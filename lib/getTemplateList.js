const axios = require("axios")

module.exports = async () => {
  const user = "k868618" // gitee 用户名

  const url = `https://gitee.com/api/v5/users/${user}/repos`

  const { status, data } = await axios(url)

  if (status != 200) return Promise.reject()

  const keyWord = "template-"

  return data.filter(({ public, name }) => public && name.startsWith(keyWord))
}
