#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { simpleGit } from "simple-git";
import ora from "ora";
import inquirer from "inquirer";
import { execSync } from "child_process";

const program = new Command();

program.version("1.0.0").action(async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What would you call your project?",
      required: true,
    },
    {
      type: "select",
      name: "package-manager",
      message: "Which package manager would you like to use?",
      choices: [
        {
          name: "npm",
          value: "npm",
        },
        {
          name: "pnpm",
          value: "pnpm",
        },
        {
          name: "yarn",
          value: "yarn",
        },
        {
          name: "bun",
          value: "bun",
        },
      ],
      default: "npm",
    },
  ]);

  const projectName = answers.name;
  const projectPath = path.join(process.cwd(), projectName);
  const packageManager = answers["package-manager"];

  if (fs.existsSync(projectPath)) {
    console.error(chalk.red(`Error: Directory ${projectName} already exists.`));
    process.exit(1);
  }

  const repoUrl = "https://github.com/arijitdn/express-starter-template.git";

  fs.mkdirsSync(projectPath);

  const spinner = ora(`Setting up Express starter template...`).start();
  const git = simpleGit();

  try {
    await git.clone(repoUrl, projectPath);
    spinner.succeed("Express starter template is ready to use!");
    await fs.remove(path.join(projectPath, ".git"));

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
    console.error(chalk.red(error.message));
    process.exit(1);
  }
});

program.parse(process.argv);
