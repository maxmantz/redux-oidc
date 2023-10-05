module.exports = {
    branches: ['master'],
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      [
        "@semantic-release/changelog",
        {
          "changelogFile": "docs/CHANGELOG.md"
        }
      ],
      '@semantic-release/npm',
      '@semantic-release/github',
    ],
  };
  