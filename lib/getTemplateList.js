const axios = require("axios")

module.exports = async () => {
  const user = "868618" // github 用户名

  const res = axios(`https://api.github.com/users/${user}/repos`)

  return res
}
