#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import setupExpressStarter from "./lib/setupExpressStarter.js";

const program = new Command();

program.version("1.0.0").action(async () => {
  const answers = await inquirer.prompt([
    {
      type: "select",
      name: "template",
      message: "Select your template",
      choices: [
        {
          name: "express-starter-template",
          value: "express-starter-template",
        },
      ],
      default: "express-starter-template",
    },
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

  const projectType = answers.template;
  const projectName = answers.name;
  const packageManager = answers["package-manager"];
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.error(chalk.red(`Error: Directory ${projectName} already exists.`));
    process.exit(1);
  }

  switch (projectType) {
    case "express-starter-template": {
      await setupExpressStarter(projectName, projectPath, packageManager);
      break;
    }

    default: {
      console.error(chalk.red("Invalid input"));
      process.exit(1);
    }
  }
});

program.parse(process.argv);
