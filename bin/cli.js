#! /usr/bin/env node

const figlet = require("figlet")
const path = require("path")
const fs = require("fs-extra")
const chalk = require("chalk")

const inquirer = require("inquirer")
const program = require("commander")
const ora = require("ora")
const getTemplateList = require("../lib/getTemplateList")
const downloadGitRepo = require("download-git-repo")

program
  // 定义命令和参数
  .command("create <app-name>")
  .description("创建新项目")
  .action(async (name) => {
    // 当前命令行选择的目录
    const cwd = process.cwd()
    // 需要创建的目录地址
    const targetDir = path.join(cwd, name)

    if (fs.existsSync(targetDir)) {
      // 询问用户是否确定要覆盖
      const { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "文件夹已存在，是否覆盖？",
          choices: [
            {
              name: "覆盖",
              value: true,
            },
            {
              name: "取消",
              value: false,
            },
          ],
        },
      ])

      if (action) {
        const rmSpinner = ora({
          text: "Removing...",
          color: "red",
        }).start()

        fs.rmSync(targetDir, { recursive: true })

        rmSpinner.succeed("覆盖成功")
      } else {
        return
      }
    }

    const spinner = ora({
      text: "获取模板列表",
      color: "yellow",
    }).start()

    const templateList = await getTemplateList()

    spinner.succeed("1、模板列表获取成功")

    const downloadSpinner = ora("开始下载模板").start()

    const cloneUrls = templateList.map((i) => i.ssh_url)

    if (cloneUrls.length == 1) {
      const [cloneUrl] = cloneUrls

      const repo = `direct:${cloneUrl}`

      const options = { clone: true, depth: 1 }

      downloadGitRepo(repo, targetDir, options, (error) => {
        if (error) {
          console.error(`downloadGitRepo ${repo} error:`, error)
        } else {
          downloadSpinner.succeed("2、模板下载成功")

          ora().succeed("success:🔥 项目创建成功。年轻人，好好干 🔥")
        }
      })
    }
  })

program
  // 配置版本号信息
  .version(`v${require("../package.json").version}`)
  .usage("<command> [option]")

program.on("--help", () => {
  const text = figlet.textSync("kenny", {
    //   font: "Ghost",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  })

  console.log(chalk.red(text))
})

// 解析用户执行命令传入参数
program.parse(process.argv)

// inquirer
//   .prompt([
//     {
//       type: "input", //type： input, number, confirm, list, checkbox ...
//       name: "name", // key 名
//       message: "Your name", // 提示信息
//       default: "my-node-cli", // 默认值
//     },
//   ])
//   .then((answers) => {
//     // 打印互用输入结果
//     console.log(answers)
//   })
