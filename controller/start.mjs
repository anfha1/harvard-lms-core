import { helper } from "afpk"
import { arrHelper } from 'afpk/helper'

import { createDeviceModel, getDeviceModel } from '#model/devices.mjs'
import { createTabModel, closeTabModel } from '#model/tabs.mjs'
import { getSessionsByDeviceIdModel } from '#model/sessions.mjs'
import { getUsersById } from '#model/users.mjs'

import socketManagerState from '#state/SocketManager.mjs'
import deviceState from '#state/device.mjs'
import { userTypesState } from '#state/userType.mjs'

socketManagerState.onDeviceClear(device_id => {
  // tiến hành xóa device data để giải phóng bộ nhớ
  delete deviceState[device_id]
  console.log('Đã dọn data của thiết bị: ', device_id)
})

export default function (io, socket, cookieParser) {
  socket.emitDevice = (device_id, name, ...params) => {
    // lấy danh sách
    let listSocketId = socketManagerState.getSocketsByDevice(device_id)
    // gửi thông báo
    listSocketId.map(socket_id => {
      io.to(socket_id).emit(name, ...params)
    })
  }

  socket.device = {
    status: 0, // 0: Chưa xác thực, 1: Đã xác thực
    id: '', // device_id
  }

  socket.checkRole = (roles, e) => {
    if (socket.device.status) {
      if (deviceState[socket.device.id].users.length > 0) {
        let checkRole = arrHelper.check2Array(deviceState[socket.device.id].users[0].roles, roles)
        if (!checkRole && e) {
          e(403)
        }
        return checkRole
      } else {
        if (e) {
          e(401)
        }
      }
    } else {
      if (e) {
        e(400)
      }
    }
    return false
  }

  // giải mã cookie
  let rawCookies = socket.handshake.headers.cookie;
  let cookies = rawCookies ? cookieParser(rawCookies) : {}

  const onError = msg => socket.emit('authError', msg)
  if (cookies.SSID !== undefined) {
    let ssid = helper.crypt.decode(cookies.SSID)
    if (ssid) {
      socket.ssid = ssid
      // cookie hợp lệ tiến hành kiểm tra device_id
      let device_id = socket.handshake.auth.token ?? ''
      const saveTab = (device_id, newTab = 0) => {
        // lấy thông tin của client như ip, os, browser, ...
        socketManagerState.addConnection(socket.id, device_id, ssid)
        let tabRef = createTabModel({
          ssid,
          device_id,
          socket_id: socket.id,
          ua: socket.handshake.headers['user-agent'],
          ip: socket.handshake.address,
        })
        tabRef.then((docTabRef) => {
          let tabId = docTabRef.id
          // sau khi lưu lại tab thì tiến hành trả về thông tin thiết bị
          let dataReturn = deviceState[device_id]
          if (newTab) {
            dataReturn.device_id = helper.crypt.encode(device_id)
          }
          socket.device.status = 1
          socket.device.id = device_id
          socket.emit('authGetInfo', dataReturn)
          // thêm sự kiện đóng tab vào socket
          socket.on('disconnect', () => {
            // xóa tab khỏi csdl khi đóng tab
            socketManagerState.removeConnection(socket.id)
            closeTabModel(tabId)
          })
        }).catch(() => {
          onError('Lỗi kết nối CSDL. EM1')
        })
      }
      if (device_id === '') {
        // chưa có device_id tiến hành tạo device id và trả về
        let newDeviceRef = createDeviceModel()
        newDeviceRef.then((docDeviceRef) => {
          let deviceId = docDeviceRef.id
          deviceState[deviceId] = {
            sessions: [],
            users: [],
          }
          saveTab(deviceId, 1)
        }).catch(() => {
          onError('Lỗi kết nối CSDL. EM2')
        })
      } else {
        // kiểm tra device_id có hợp lệ không
        device_id = helper.crypt.decode(device_id)
        if (device_id) {
          // kiểm tra device_id có tồn tại trong csdl không
          let deviceRef = getDeviceModel(device_id)
          deviceRef.then((listDeviceDoc) => {
            if (listDeviceDoc.exists) {
              // tiến hành lấy thông tin của device_id
              deviceState[device_id] = {
                sessions: [],
                users: [],
              }

              getSessionsByDeviceIdModel(device_id).then((sessions) => {
                let listUserId = []
                sessions.forEach((session) => {
                  let sessionData = session.data()
                  sessionData.id = session.id
                  deviceState[device_id].sessions.push(sessionData)
                  listUserId.push(sessionData.user_id)
                })
                if (listUserId.length === 0) {
                  saveTab(device_id)
                } else {
                  // lấy thông tin của user
                  getUsersById(listUserId).then((users) => {
                    users.forEach((user) => {
                      let userData = user.data()
                      userData.id = user.id
                      // bỏ 1 số trường trước khi thêm vào state username, password, createdAt, timestamp
                      delete userData.username
                      delete userData.password
                      delete userData.createdAt
                      delete userData.timestamp
                      // lấy roles của user
                      let userType = userTypesState[userData.usertype]
                      userData.roles = userType.roles
                      // lấy vai trò của người dùng trong hệ thống
                      userData.user_type_name = userType.name
                      deviceState[device_id].users.push(userData)
                      // device_id tồn tại trong csdl tiến hành lưu tab
                      saveTab(device_id)
                    })
                  }).catch(() => {
                    onError('Lỗi kết nối CSDL. EM3')
                  })
                }
              }).catch(() => {
                onError('Lỗi kết nối CSDL. EM4')
              })
            } else {
              // device_id không tồn tại trong csdl tiến hành tạo mới
              let newDeviceRef = createDeviceModel()
              newDeviceRef.then((docDeviceRef) => {
                let deviceId = docDeviceRef.id
                deviceState[deviceId] = {
                  sessions: [],
                  users: [],
                }
                saveTab(deviceId, 1)
              }).catch(() => {
                onError('Lỗi kết nối CSDL. EM5')
              })
            }
          }).catch(() => {
            onError('Lỗi kết nối CSDL. EM6')
          })
        } else {
          onError('Phương thức đăng nhập không hợp lệ. EM7')
        }
      }
    } else {
      onError('Phương thức đăng nhập không hợp lệ. EM7')
    }
  } else {
    onError('Phương thức đăng nhập không hợp lệ. EM9')
  }
}