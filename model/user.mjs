import { helper } from "afpk"
import db from './db.mjs'

// thêm một tài khoản mới
export function createUsersModel(userInfo) {
  // kiểm tra dữ liệu trước khi thêm
  // thời gian
  let now = helper.time.now()
  // kiểm tra tags
  if (!userInfo.tags || typeof userInfo.tags !== 'object') {
    userInfo.tags = []
  }
  // kiểm tra usertype
  if (!userInfo.usertype || typeof userInfo.usertype !== 'string') {
    userInfo.usertype = 'user'
  }
  // kiểm tra status
  if (!userInfo.status || typeof userInfo.status !== 'number') {
    userInfo.status = 1
  }
  // kiểm tra lock_info
  if (!userInfo.lock_info || typeof userInfo.lock_info !== 'object') {
    userInfo.lock_info = {
      lock_time: "", // thời gian khóa dạng chuỗi
      lock_reason: "", // lý do khóa
      lock_by: "", // người khóa
    }
  }
  // kiểm tra name
  if (!userInfo.name || typeof userInfo.name !== 'string') {
    userInfo.name = ''
  }
  // kiểm tra avatar
  if (!userInfo.avatar || typeof userInfo.avatar !== 'string') {
    userInfo.avatar = ''
  }
  // kiểm tra background
  if (!userInfo.background || typeof userInfo.background !== 'string') {
    userInfo.background = ''
  }
  // kiểm tra email
  if (!userInfo.email || typeof userInfo.email !== 'string') {
    userInfo.email = ''
  }
  // kiểm tra phone
  if (!userInfo.phone || typeof userInfo.phone !== 'string') {
    userInfo.phone = ''
  }
  return db.collection('users').add({
    timestamp: now.toMillis(),
    createdAt: now.toISO(),
    ...userInfo
  })
}

// kiểm tra username đã tồn tại chưa
export function checkUsernameExist(username) {
  return db.collection('users').where('username', '==', username).get()
}

// kiểm tra email đã tồn tại chưa
export function checkEmailExist(email) {
  return db.collection('users').where('email', '==', email).get()
}

// kiểm tra số điện thoại đã tồn tại chưa
export function checkPhoneExist(phone) {
  return db.collection('users').where('phone', '==', phone).get()
}

// thay đổi thông tin tài khoản
export function updateUser(id, userInfo) {
  return db.collection('users').doc(id).update(userInfo)
}

// khóa tài khoản
export function lockUser(id, lockInfo) {
  return db.collection('users').doc(id).update({
    status: 2,
    lock_info: lockInfo
  })
}

// xóa tài khoản
export function deleteUser(id) {
  return db.collection('users').doc(id).delete()
}

// lấy thông tin user theo id
export function getUserById(id) {
  return db.collection('users').doc(id).get()
}

// lấy danh sách user theo mảng id
export function getUsersById(ids) {
  return db.collection('users').where('id', 'in', ids).get()
}