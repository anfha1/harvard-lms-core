import { helper } from "afpk"

import mongo from './config.mjs'
import { getId } from './config.mjs'

const db_name = 'db_af'
const coll_name = 'tb_devices'

var db = mongo.client.db(db_name)
var coll = db.collection(coll_name)

/*
id,
token,
*/

// hàm thêm device
export function create_device() {

  return new Promise((resolve, reject) => {
    getId('db_devices')
    .then(id => {
      let token = helper.crypt.encode(id)
      coll.insertOne({ id, token })
      .then(() => {
        resolve({ id, token })
      })
      .catch(reject)
    })
    .catch(reject)
  })
}

// kiểm tra device
export function check_device(token) {
  return new Promise((resolve, reject) => {
    coll.findOne({ token })
    .then(resolve)
    .catch(reject)
  })
}


// mongodb.db.collection('db_devices').find()

// hàm xóa device