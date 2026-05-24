"use server";

import { Octokit } from "octokit";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_OWNER = process.env.GITHUB_OWNER || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "lingkoraq-assets";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

function getOctokit() {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");
  return new Octokit({ auth: GITHUB_TOKEN });
}

export async function uploadImageToGitHub(
  base64Data: string,
  fileName: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const octokit = getOctokit();
    const content = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const path = `uploads/${Date.now()}-${fileName}`;

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      message: `Upload ${fileName} via Lingkoraq`,
      content,
      branch: GITHUB_BRANCH,
    });

    const url = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;

    return { success: true, url };
  } catch (err: any) {
    console.error("GitHub upload error:", err);
    return { success: false, error: err.message || "Upload failed" };
  }
}

export async function deleteImageFromGitHub(
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const octokit = getOctokit();

    const { data } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      ref: GITHUB_BRANCH,
    });

    if (Array.isArray(data)) throw new Error("Path is a directory");

    await octokit.rest.repos.deleteFile({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: `Delete ${filePath} via Lingkoraq`,
      sha: data.sha,
      branch: GITHUB_BRANCH,
    });

    return { success: true };
  } catch (err: any) {
    console.error("GitHub delete error:", err);
    return { success: false, error: err.message || "Delete failed" };
  }
}
