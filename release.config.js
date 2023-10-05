module.exports = {
  branches: ["master"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "docs/CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/npm",
      {
        npmPublish: true,
        tarballDir: "dist",
        // Add the following line to publish as a public package
        publishConfig: {
          access: "public",
        },
      },
    ],
    "@semantic-release/github",
  ],
};
