(function () {

/*
* Copyright 2014-2016 Dominick Baier, Brock Allen
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

// globals
var OidcClient = require('./oidc-client');
var _promiseFactory = OidcClient._promiseFactory;
var _httpRequest  = OidcClient._httpRequest;

window.localStorage = window.localStorage || { getItem: function(key) {return key;}};


function copy(obj, target) {
    target = target || {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            target[key] = obj[key];
        }
    }
    return target;
}

function Token(other) {
    if (other) {
        this.profile = other.profile;
        this.id_token = other.id_token;
        this.access_token = other.access_token;
        if (other.access_token) {
            this.expires_at = parseInt(other.expires_at);
        }
        else if (other.id_token) {
            this.expires_at = other.profile.exp;
        }
        else {
            throw Error("Either access_token or id_token required.");
        }
        this.scope = other.scope;
        this.session_state = other.session_state;
    }
    else {
        this.expires_at = 0;
    }

    Object.defineProperty(this, "scopes", {
        get: function () {
            return (this.scope || "").split(" ");
        }
    });

    Object.defineProperty(this, "expired", {
        get: function () {
            var now = parseInt(Date.now() / 1000);
            return this.expires_at < now;
        }
    });

    Object.defineProperty(this, "expires_in", {
        get: function () {
            var now = parseInt(Date.now() / 1000);
            return this.expires_at - now;
        }
    });
}

Token.fromResponse = function (response) {
    if (response.access_token) {
        var now = parseInt(Date.now() / 1000);
        response.expires_at = now + parseInt(response.expires_in);
    }
    return new Token(response);
}

Token.fromJSON = function (json) {
    if (json) {
        try {
            var obj = JSON.parse(json);
            return new Token(obj);
        }
        catch (e) {
        }
    }
    return new Token(null);
}

Token.prototype.toJSON = function () {
    return JSON.stringify({
        profile: this.profile,
        id_token: this.id_token,
        access_token: this.access_token,
        expires_at: this.expires_at,
        scope: this.scopes.join(" "),
        session_state: this.session_state
    });
}

function FrameLoader(url, config) {
    this.url = url;
    config = config || {};
    config.cancelDelay = config.cancelDelay || 5000;
    this.config = config;
}

FrameLoader.prototype.loadAsync = function (url) {
    var self = this;
    url = url || this.url;

    if (!url) {
        return _promiseFactory.reject(Error("No url provided"));
    }

    return _promiseFactory.create(function (resolve, reject) {
        var frame = window.document.createElement("iframe");
        frame.style.display = "none";

        function cleanup() {
            window.removeEventListener("message", message, false);
            if (handle) {
                window.clearTimeout(handle);
            }
            handle = null;
            window.document.body.removeChild(frame);
        }

        function cancel(e) {
            cleanup();
            reject();
        }

        function message(e) {
            if (handle && e.origin === location.protocol + "//" + location.host && e.source == frame.contentWindow) {
                cleanup();
                resolve(e.data);
            }
        }

        var handle = window.setTimeout(cancel, self.config.cancelDelay);
        window.addEventListener("message", message, false);
        window.document.body.appendChild(frame);
        frame.src = url;
    });
}

function loadToken(mgr) {
    mgr._token = null;
    if (mgr._settings.persist) {
        var tokenJson = mgr._settings.store.getItem(mgr._settings.persistKey);
        if (tokenJson) {
            var token = Token.fromJSON(tokenJson);
            if (!token.expired) {
                mgr._token = token;
            }
        }
    }
}

function configureTokenExpiring(mgr) {

    function callback() {
        handle = null;
        mgr._callTokenExpiring();
    }

    var handle = null;

    function cancel() {
        if (handle) {
            window.clearTimeout(handle);
            handle = null;
        }
    }

    function setup(duration) {
        handle = window.setTimeout(callback, duration * 1000);
    }

    function configure() {
        cancel();

        if (!mgr.expired) {
            var duration = mgr.expires_in;
            if (duration > 60) {
                setup(duration - 60);
            }
            else {
                callback();
            }
        }
    }

    configure();

    mgr.addOnTokenObtained(configure);
    mgr.addOnTokenRemoved(cancel);
}

function configureAutoRenewToken(mgr) {

    if (mgr._settings.silent_redirect_uri && mgr._settings.silent_renew) {

        mgr.addOnTokenExpiring(function () {
            mgr.renewTokenSilentAsync().catch(function (e) {
                mgr._callSilentTokenRenewFailed();
                console.error(e && e.message || "Unknown error");
            });
        });

    }
}

function configureTokenExpired(mgr) {

    function callback() {
        handle = null;

        if (mgr._token) {
            mgr.saveToken(null);
        }

        mgr._callTokenExpired();
    }

    var handle = null;

    function cancel() {
        if (handle) {
            window.clearTimeout(handle);
            handle = null;
        }
    }

    function setup(duration) {
        handle = window.setTimeout(callback, duration * 1000);
    }

    function configure() {
        cancel();
        if (mgr.expires_in > 0) {
            // register 1 second beyond expiration so we don't get into edge conditions for expiration
            setup(mgr.expires_in + 1);
        }
    }

    configure();

    mgr.addOnTokenObtained(configure);
    mgr.addOnTokenRemoved(cancel);
}

function TokenManager(settings) {
    this._settings = settings || {};

    if (typeof this._settings.persist === 'undefined') {
        this._settings.persist = true;
    }
    this._settings.store = this._settings.store || window.localStorage;
    this._settings.persistKey = this._settings.persistKey || "TokenManager.token";

    this.oidcClient = new OidcClient(this._settings);

    this._callbacks = {
        tokenRemovedCallbacks: [],
        tokenExpiringCallbacks: [],
        tokenExpiredCallbacks: [],
        tokenObtainedCallbacks: [],
        silentTokenRenewFailedCallbacks: []
    };

    Object.defineProperty(this, "profile", {
        get: function () {
            if (this._token) {
                return this._token.profile;
            }
        }
    });
    Object.defineProperty(this, "id_token", {
        get: function () {
            if (this._token) {
                return this._token.id_token;
            }
        }
    });
    Object.defineProperty(this, "access_token", {
        get: function () {
            if (this._token && !this._token.expired) {
                return this._token.access_token;
            }
        }
    });
    Object.defineProperty(this, "expired", {
        get: function () {
            if (this._token) {
                return this._token.expired;
            }
            return true;
        }
    });
    Object.defineProperty(this, "expires_in", {
        get: function () {
            if (this._token) {
                return this._token.expires_in;
            }
            return 0;
        }
    });
    Object.defineProperty(this, "expires_at", {
        get: function () {
            if (this._token) {
                return this._token.expires_at;
            }
            return 0;
        }
    });
    Object.defineProperty(this, "scope", {
        get: function () {
            return this._token && this._token.scope;
        }
    });
    Object.defineProperty(this, "scopes", {
        get: function () {
            if (this._token) {
                return [].concat(this._token.scopes);
            }
            return [];
        }
    });
    Object.defineProperty(this, "session_state", {
        get: function () {
            if (this._token) {
                return this._token.session_state;
            }
        }
    });

    var mgr = this;
    loadToken(mgr);
    if (mgr._settings.store instanceof window.localStorage.constructor) {
        window.addEventListener("storage", function (e) {
            if (e.key === mgr._settings.persistKey) {
                loadToken(mgr);

                if (mgr._token) {
                    mgr._callTokenObtained();
                }
                else {
                    mgr._callTokenRemoved();
                }
            }
        });
    }
    configureTokenExpired(mgr);
    configureAutoRenewToken(mgr);

    // delay this so consuming apps can register for callbacks first
    window.setTimeout(function () {
        configureTokenExpiring(mgr);
    }, 0);
}

/**
 * @param {{ create:function(successCallback:function(), errorCallback:function()):Promise, resolve:function(value:*):Promise, reject:function():Promise}} promiseFactory
 */
TokenManager.setPromiseFactory = function (promiseFactory) {
    _promiseFactory = promiseFactory;
};

/**
 * @param {{getJSON:function(url:string, config:{ headers: object.<string, string> })}} httpRequest
 */
TokenManager.setHttpRequest = function (httpRequest) {
    if ((typeof httpRequest !== 'object') || (typeof httpRequest.getJSON !== 'function')) {
        throw Error('The provided value is not a valid http request.');
    }

    _httpRequest = httpRequest;
};

TokenManager.prototype._callTokenRemoved = function () {
    this._callbacks.tokenRemovedCallbacks.forEach(function (cb) {
        cb();
    });
}

TokenManager.prototype._callTokenExpiring = function () {
    this._callbacks.tokenExpiringCallbacks.forEach(function (cb) {
        cb();
    });
}

TokenManager.prototype._callTokenExpired = function () {
    this._callbacks.tokenExpiredCallbacks.forEach(function (cb) {
        cb();
    });
}

TokenManager.prototype._callTokenObtained = function () {
    this._callbacks.tokenObtainedCallbacks.forEach(function (cb) {
        cb();
    });
}

TokenManager.prototype._callSilentTokenRenewFailed = function () {
    this._callbacks.silentTokenRenewFailedCallbacks.forEach(function (cb) {
        cb();
    });
}

TokenManager.prototype.saveToken = function (token) {
    if (token && !(token instanceof Token)) {
        token = Token.fromResponse(token);
    }

    this._token = token;

    if (this._settings.persist && !this.expired) {
        this._settings.store.setItem(this._settings.persistKey, token.toJSON());
    }
    else {
        this._settings.store.removeItem(this._settings.persistKey);
    }

    if (token) {
        this._callTokenObtained();
    }
    else {
        this._callTokenRemoved();
    }
}

TokenManager.prototype.addOnTokenRemoved = function (cb) {
    this._callbacks.tokenRemovedCallbacks.push(cb);
}

TokenManager.prototype.addOnTokenObtained = function (cb) {
    this._callbacks.tokenObtainedCallbacks.push(cb);
}

TokenManager.prototype.addOnTokenExpiring = function (cb) {
    this._callbacks.tokenExpiringCallbacks.push(cb);
}

TokenManager.prototype.addOnTokenExpired = function (cb) {
    this._callbacks.tokenExpiredCallbacks.push(cb);
}

TokenManager.prototype.addOnSilentTokenRenewFailed = function (cb) {
    this._callbacks.silentTokenRenewFailedCallbacks.push(cb);
}

TokenManager.prototype.removeToken = function () {
    this.saveToken(null);
}

TokenManager.prototype.redirectForToken = function () {
    var oidc = this.oidcClient;
    return oidc.createTokenRequestAsync().then(function (request) {
        window.location = request.url;
    }, function (err) {
        console.error("TokenManager.redirectForToken error: " + (err && err.message || "Unknown error"));
        return _promiseFactory.reject(err);
    });
}

TokenManager.prototype.redirectForLogout = function () {
    var mgr = this;
    return mgr.oidcClient.createLogoutRequestAsync(mgr.id_token).then(function (url) {
        mgr.removeToken();
        window.location = url;
    }, function (err) {
        console.error("TokenManager.redirectForLogout error: " + (err && err.message || "Unknown error"));
        return _promiseFactory.reject(err);
    });
}

TokenManager.prototype.processTokenCallbackAsync = function (queryString) {
    var mgr = this;
    return mgr.oidcClient.processResponseAsync(queryString).then(function (token) {
        mgr.saveToken(token);
    });
}

TokenManager.prototype.renewTokenSilentAsync = function () {
    var mgr = this;

    if (!mgr._settings.silent_redirect_uri) {
        return _promiseFactory.reject(Error("silent_redirect_uri not configured"));
    }

    var settings = copy(mgr._settings);
    settings.redirect_uri = settings.silent_redirect_uri;
    if (!settings.prompt) {
        settings.prompt = "none";
    }

    var oidc = new OidcClient(settings);
    return oidc.createTokenRequestAsync().then(function (request) {
        var frame = new FrameLoader(request.url, { cancelDelay: mgr._settings.silent_renew_timeout });
        return frame.loadAsync().then(function (hash) {
            return oidc.processResponseAsync(hash).then(function (token) {
                mgr.saveToken(token);
            });
        });
    });
}

TokenManager.prototype.processTokenCallbackSilent = function (hash) {
    if (window.parent && window !== window.parent) {
        var hash = hash || window.location.hash;
        if (hash) {
            window.parent.postMessage(hash, location.protocol + "//" + location.host);
        }
    }
}

TokenManager.prototype.openPopupForTokenAsync = function (popupSettings) {
    popupSettings = popupSettings || {};
    popupSettings.features = popupSettings.features || "location=no,toolbar=no";
    popupSettings.target = popupSettings.target || "_blank";

    var callback_prefix = "tokenmgr_callback_";

    // this is a shared callback
    if (!window.openPopupForTokenAsyncCallback) {
        window.openPopupForTokenAsyncCallback = function (hash) {
            var result = OidcClient.parseOidcResult(hash);
            if (result && result.state && window[callback_prefix + result.state]) {
                window[callback_prefix + result.state](hash);
            }
        }
    }

    var mgr = this;
    var settings = copy(mgr._settings);
    settings.redirect_uri = settings.popup_redirect_uri || settings.redirect_uri;

    if (mgr._pendingPopup) {
        return _promiseFactory.create(function (resolve, reject) {
            reject(Error("Already a pending popup token request."));
        });
    }

    var popup = window.open(settings.redirect_uri, popupSettings.target, popupSettings.features);
    if (!popup) {
        return _promiseFactory.create(function (resolve, reject) {
            reject(Error("Error opening popup."));
        });
    }

    mgr._pendingPopup = true;

    function cleanup(name) {
        if (handle) {
            window.clearInterval(handle);
        }
        popup.close();
        delete mgr._pendingPopup;
        if (name) {
            delete window[name];
        }
    }

    var reject_popup;
    function checkClosed() {
        if (!popup.window) {
            cleanup();
            reject_popup(Error("Popup closed"));
        }
    }
    var handle = window.setInterval(checkClosed, 1000);

    return _promiseFactory.create(function (resolve, reject) {
        reject_popup = reject;

        var oidc = new OidcClient(settings);
        oidc.createTokenRequestAsync().then(function (request) {

            var callback_name = callback_prefix + request.request_state.state;
            window[callback_name] = function (hash) {
                cleanup(callback_name);

                oidc.processResponseAsync(hash).then(function (token) {
                    mgr.saveToken(token);
                    resolve();
                }, function (err) {
                    reject(err);
                });
            };

            // give the popup 5 seconds to ready itself, otherwise fail
            var seconds_to_wait = 5;
            var interval = 500;
            var total_times = (seconds_to_wait*1000) / interval;
            var count = 0;
            function redirectPopup() {
                if (popup.setUrl) {
                    popup.setUrl(request.url);
                }
                else if (count < total_times) {
                    count++;
                    window.setTimeout(redirectPopup, interval);
                }
                else {
                    cleanup(callback_name);
                    reject(Error("Timeout error on popup"));
                }
            }
            redirectPopup();
        }, function (err) {
            cleanup();
            reject(err);
        });
    });
}

TokenManager.prototype.processTokenPopup = function (hash) {
    hash = hash || window.location.hash;

    window.setUrl = function (url) {
        window.location = url;
    }

    if (hash) {
        window.opener.openPopupForTokenAsyncCallback(hash);
    }
}


    // exports
    module.exports = TokenManager;
})();
/*eslint-enable */
// jscs: enable
