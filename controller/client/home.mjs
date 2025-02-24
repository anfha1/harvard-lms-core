import { helper } from "afpk"

import { createDeviceModel, getDeviceModel } from '#model/device.mjs'
import { createTabModel, closeTabModel } from '#model/tab.mjs'
import { getAllSessionModelByDeviceId } from '#model/session.mjs'
import { getUsersById } from '#model/user.mjs'

import SocketManagerState from '#state/SocketManager.mjs'
import deviceState from '#state/device.mjs'
import { userTypesState } from '#state/userType.mjs'

export default function (io, socket, cookieParser) {
  // giải mã cookie
  let rawCookies = socket.handshake.headers.cookie;
  let cookies = rawCookies ? cookieParser(rawCookies) : {}

  const onError = msg => socket.emit('authError', msg)
  if (cookies.SSID !== undefined) {
    let ssid = helper.crypt.decode(cookies.SSID)
    if (ssid) {
      // cookie hợp lệ tiến hành kiểm tra device_id
      let device_id = socket.handshake.auth.token ?? ''
      const saveTab = (device_id, newTab = 0) => {
        // lấy thông tin của client như ip, os, browser, ...
        SocketManagerState.addConnection(socket.id, device_id, ssid)
        let tabRef = createTabModel({
          ssid,
          device_id,
          socket_id: socket.id,
          ua: socket.handshake.headers['user-agent'],
          ip: socket.handshake.address,
        })
        tabRef.then((docTabRef) => {
          let tabId = docTabRef._path.segments[1]
          // sau khi lưu lại tab thì tiến hành trả về thông tin thiết bị
          let dataReturn = deviceState[device_id]
          if (newTab) {
            dataReturn.device_id = helper.crypt.encode(device_id)
          }
          console.log('dataReturn', dataReturn)
          socket.emit('authGetInfo', dataReturn)
          // thêm sự kiện đóng tab vào socket
          socket.on('disconnect', () => {
            // xóa tab khỏi csdl khi đóng tab
            SocketManagerState.removeConnection(socket.id)
            closeTabModel(tabId)
          })
        }).catch(() => {
          onError('Lỗi kết nối CSDL.')
        })
      }
      if (device_id === '') {
        // chưa có device_id tiến hành tạo device id và trả về
        let newDeviceRef = createDeviceModel()
        newDeviceRef.then((docDeviceRef) => {
          let deviceId = docDeviceRef._path.segments[1]
          deviceState[deviceId] = {
            sessions: [],
            users: [],
          }
          saveTab(deviceId, 1)
        }).catch(() => {
          onError('Lỗi kết nối CSDL.')
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

              getAllSessionModelByDeviceId(device_id).then((sessions) => {
                let listUserId = []
                sessions.forEach((session) => {
                  let sessionData = session.data()
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
                    onError('Lỗi kết nối CSDL.')
                  })
                }
              }).catch(() => {
                onError('Lỗi kết nối CSDL.')
              })
            } else {
              // device_id không tồn tại trong csdl tiến hành tạo mới
              let newDeviceRef = createDeviceModel()
              newDeviceRef.then((docDeviceRef) => {
                let deviceId = docDeviceRef._path.segments[1]
                deviceState[deviceId] = {
                  sessions: [],
                  users: [],
                }
                saveTab(deviceId, 1)
              }).catch(() => {
                onError('Lỗi kết nối CSDL.')
              })
            }
          }).catch(() => {
            onError('Lỗi kết nối CSDL.')
          })
        } else {
          onError('Phương thức đăng nhập không hợp lệ.')
        }
      }
    } else {
      onError('Phương thức đăng nhập không hợp lệ.')
    }
  } else {
    onError('Phương thức đăng nhập không hợp lệ.')
  }
}