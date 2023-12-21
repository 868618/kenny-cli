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
      text: "获取远程模板",
      color: "yellow",
    }).start()

    getTemplateList()
      .then((res) => {
        const fullNames = res.data
          .filter((i) => {
            const { visibility, name } = i
            return visibility == "public" && name.startsWith("template-")
          })
          .map((i) => i.full_name)

        if (fullNames.length == 1) {
          const [fullName] = fullNames

          downloadGitRepo(fullName, targetDir, (error) => {
            if (error) {
              console.error(error)
            } else {
              spinner.succeed("成功")
            }
          })
        }
      })
      .finally(() => {
        spinner.stop()
      })
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
