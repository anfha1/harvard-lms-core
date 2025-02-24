import { helper } from "afpk"
import db from './db.mjs'

export function createTabModel(data) {
  // sử dụng firebase để lưu lại thông tin thiết bị
  let now = helper.time.now()
  return db.collection('tabs').add({
    timestamp: now.toMillis(),
    createdAt: now.toISO(),
    closeAt: '',
    ...data,
  })
}

export function closeTabModel(id) {
  // thêm thuộc tính close_at vào tab
  return db.collection('tabs').doc(id).update({
    closeAt: helper.time.now().toISO(),
  })
}