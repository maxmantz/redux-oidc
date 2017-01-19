import jsdom from 'jsdom';
import StorageShim from 'node-storage-shim';

const DEFAULT_HTML = '<html><body></body></html>';

global.document = jsdom.jsdom(DEFAULT_HTML);

global.window = document.defaultView;

global.navigator = window.navigator;

window.localStorage = new StorageShim();

global.localStorage = window.localStorage;
