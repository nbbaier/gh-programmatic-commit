import { Octokit } from "@octokit/rest";

const client = new Octokit({
  auth: Bun.env.GH_REPO_TOKEN,
});

const owner = "nbbaier";
const repo = "test-ground";
const commits = await client.rest.repos.listCommits({
  owner,
  repo,
});

const commitSHA = commits.data[0].sha;

const {
  data: { sha: currentTreeSHA },
} = await client.rest.git.createTree({
  owner,
  repo,
  tree: [
    {
      path: "third_new_file.txt",
      content: "will this go onto branch_1",
      mode: "100644",
      type: "commit",
    },
  ],
  base_tree: commitSHA,
  message: "Updated programatically with Octokit",
  parents: [commitSHA],
});

console.log("currentTreeSHA: ", currentTreeSHA);

const {
  data: { sha: newCommitSHA },
} = await client.rest.git.createCommit({
  owner,
  repo,
  tree: currentTreeSHA,
  message: "Updated programatically with Octokit",
  parents: [commitSHA],
});

console.log("newCommitSHA: ", newCommitSHA);

console.log(
  await client.rest.git.updateRef({
    owner,
    repo,
    ref: "heads/main",
    sha: newCommitSHA,
  })
);
