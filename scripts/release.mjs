#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ConventionalChangelog } from "conventional-changelog";
import { Bumper } from "conventional-recommended-bump";
import semver from "semver";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const pkgPath = path.join(rootDir, "package.json");
const readmePath = path.join(rootDir, "README.md");
const dryRun = process.argv.includes("--dry-run");

const TAG_PREFIX = "v";
const START_MARKER = "<!-- changelog:start -->";
const END_MARKER = "<!-- changelog:end -->";
const EMPTY_PLACEHOLDER =
  "_No releases yet — versioning starts from the first real feature/fix commit after this point._";

const git = (...args) =>
  execFileSync("git", args, { cwd: rootDir, encoding: "utf8" }).trim();

function assertCleanWorkingTree() {
  if (git("status", "--porcelain")) {
    console.error(
      "Working tree is not clean. Commit or stash changes before running the release.",
    );
    process.exit(1);
  }
}

async function getReleaseType() {
  const { releaseType, reason } = await new Bumper(rootDir)
    .loadPreset("conventionalcommits")
    .tag({ prefix: TAG_PREFIX })
    .bump();
  return { releaseType, reason };
}

async function generateChangelogEntry(pkg) {
  const generator = new ConventionalChangelog(rootDir)
    .package(pkg)
    .loadPreset("conventionalcommits")
    .tags({ prefix: TAG_PREFIX })
    .options({ releaseCount: 1 });

  let entry = "";
  for await (const chunk of generator.write()) {
    entry += chunk;
  }
  return entry.trim();
}

function spliceIntoReadme(entry) {
  const readme = readFileSync(readmePath, "utf8");
  const start = readme.indexOf(START_MARKER);
  const end = readme.indexOf(END_MARKER);
  if (start === -1 || end === -1) {
    throw new Error(
      `Could not find ${START_MARKER} / ${END_MARKER} markers in README.md`,
    );
  }

  const before = readme.slice(0, start + START_MARKER.length);
  const after = readme.slice(end);
  const existing = readme
    .slice(start + START_MARKER.length, end)
    .trim()
    .replace(EMPTY_PLACEHOLDER, "")
    .trim();

  const body = [entry, existing].filter(Boolean).join("\n\n");
  return `${before}\n\n${body}\n\n${after}`;
}

async function main() {
  assertCleanWorkingTree();

  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const { releaseType, reason } = await getReleaseType();

  if (!releaseType) {
    console.log(
      "Nothing to release: no feat/fix/BREAKING CHANGE commits since the last tag.",
    );
    return;
  }

  const nextVersion = semver.inc(pkg.version, releaseType);
  console.log(
    `${pkg.version} -> ${nextVersion} (${releaseType}${reason ? `: ${reason}` : ""})`,
  );

  const bumpedPkg = { ...pkg, version: nextVersion };
  const entry = await generateChangelogEntry(bumpedPkg);
  const nextReadme = spliceIntoReadme(entry);

  if (dryRun) {
    console.log("\n--- dry run: changelog entry ---\n");
    console.log(entry);
    return;
  }

  writeFileSync(pkgPath, `${JSON.stringify(bumpedPkg, null, 2)}\n`);
  writeFileSync(readmePath, nextReadme);

  git("add", "package.json", "README.md");
  git("commit", "-m", `chore(release): v${nextVersion}`);
  git("tag", "-a", `v${nextVersion}`, "-m", `v${nextVersion}`);

  console.log(`Released v${nextVersion}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
