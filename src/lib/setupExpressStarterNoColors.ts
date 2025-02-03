import fs from "fs-extra";
import ora from "ora";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";
import { simpleGit } from "simple-git";
import { EXPRESS_STARTER_REPO } from "../constants.js";

export default async function setupExpressStarterNoColors(
  projectName: string,
  projectPath: string,
  packageManager: string
) {
  // Repository URL
  const repoUrl = EXPRESS_STARTER_REPO;
  // Create directory for the project
  fs.mkdirsSync(projectPath);

  // Start Git cloning
  const spinner = ora(`Setting up Express starter template...`).start();
  const git = simpleGit();

  try {
    await git.clone(repoUrl, projectPath, [
      "--branch",
      "no-colors",
      "--single-branch",
    ]);
    spinner.succeed("Express starter template is ready to use!");

    // Remove .git folder
    await fs.remove(path.join(projectPath, ".git"));

    // Install dependencies
    process.chdir(projectPath);
    spinner.start("Installing dependencies...");
    execSync(`${packageManager} install`, { stdio: "inherit" });
    spinner.succeed("Dependencies installed successfully!");

    console.log(chalk.green(`${projectName} is ready to use!`));
    console.log(
      chalk.green(
        `cd ${projectName} and run ${
          packageManager === "npm" ? "npm run dev" : `${packageManager} dev`
        }`
      )
    );
  } catch (error) {
    spinner.fail("Failed to setup the project.");
    console.error(chalk.red((error as any).message));
    process.exit(1);
  }
}
