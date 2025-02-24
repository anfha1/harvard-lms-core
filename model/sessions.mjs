import { helper } from "afpk"
import db from './db.mjs'

export function createSessionModel(user_id, device_id) {
  // sử dụng firebase để lưu lại thông tin thiết bị
  let now = helper.time.now()
  return db.collection('session').add({
    user_id,
    device_id,
    status: 1,
    timestamp: now.toMillis(),
    createdAt: now.toISO(),
  })
}

// cập nhật thông tin phiên đăng nhập
export function updateSessionModel(id, dataUpdate) {
  // cập nhật thông tin phiên đăng nhập
  return db.collection('session').doc(id).update(dataUpdate)
}

// xóa phiên đă nhập
export function deleteSessionModel(id) {
  // xóa phiên đăng nhập
  return db.collection('session').doc(id).delete()
}

// lấy tất cả phiên đăng nhập theo device_id
export function getSessionsByDeviceIdModel(device_id) {
  return db.collection('session').where('device_id', '==', device_id).get()
}

// lấy tất cả phiên đăng nhập theo user_id
export function getSessionsByUserIdModel(user_id) {
  return db.collection('session').where('user_id', '==', user_id).get()
}

// kiểm tra trùng session device_id, user_id
export function checkSessionExist(device_id, user_id) {
  return db.collection('session').where('device_id', '==', device_id).where('user_id', '==', user_id).get()
}