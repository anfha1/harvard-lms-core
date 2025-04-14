import { readFileSync, existsSync } from 'fs';

let envName = process.argv[2] || 'dev'

var config = {}
let path_dir = `./config/${envName}.json`
if (!existsSync(path_dir)) {
  path_dir = ''
}

if (path_dir) {
  let a = readFileSync(path_dir)
  if (a) {
    config = JSON.parse(a)
  } else {
    console.log("Lỗi không đọc được config")
  }
}

export default config