import { readFileSync, existsSync, copyFileSync } from 'fs';

var config = {}
let path_dir = './config/env.json'
if (!existsSync(path_dir)) {
  let env_prod = './config/env.prod.json'
  if (existsSync(env_prod)) {
    copyFileSync(env_prod, path_dir)
  } else {
    path_dir = ''
  }
}

if (path_dir) {
  let a = readFileSync(path_dir)
  if (a) {
    config = JSON.parse(a)
  } else {
    e("Lỗi không đọc được file")
  }
}

export default config