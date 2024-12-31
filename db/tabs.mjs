import { helper } from "afpk"

import mongo from './config.mjs'

let demo_data_tab = {
  _id: "", // mongodb cung cấp
  socket_id: "", // socket cung cấp
  start_at: "", // thêm khi khởi tạo
  close_at: "", // thêm khi đóng
  device_token: "", // thêm khi xác thực device,
  device_info: {}, // phân tích User-Agent
}

export function create_tab(data) {
  let db = mongo.client.db('db_af')
  let coll = db.collection("tb_tabs")

  return coll.insertOne({
    ...data,
    start_at: helper.time.now().toISO(),
  })
}

export function add_device(socket_id, device_token) {
  let db = mongo.client.db('db_af')
  let coll = db.collection("tb_tabs")
  return coll.updateOne({ socket_id }, {
    $set: {
      device_token
    }
  })
}

export function close_tab(socket_id) {
  let db = mongo.client.db('db_af')
  let coll = db.collection("tb_tabs")
  return coll.updateOne({ socket_id }, {
    $set: {
      close_at: helper.time.now().toISO()
    }
  })
}

export function close_all_tab() {
  let db = mongo.client.db('db_af')
  let coll = db.collection("tb_tabs")
  return coll.updateMany({ close_at: { $exists: false } }, {
    $set: {
      close_at: helper.time.now().toISO()
    }
  })
}

