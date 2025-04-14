import { helper } from "afpk"
import db from './db.mjs'

export function createDeviceModel() {
  // sử dụng firebase để lưu lại thông tin thiết bị
  let now = helper.time.now()
  return db.collection('devices').add({
    timestamp: now.toMillis(),
    createdAt: now.toISO(),
  })
}

export function getDeviceModel(id) {
  return db.collection('devices').doc(id).get()
}