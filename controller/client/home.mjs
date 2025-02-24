import { helper } from "afpk"
import { usernameValidate, passwordValidate } from 'afpk/validator'

import { createDeviceModel, getDeviceModel } from '#model/devices.mjs'
import { createTabModel, closeTabModel } from '#model/tabs.mjs'
import { createSessionModel, getSessionsByDeviceIdModel, deleteSessionModel } from '#model/sessions.mjs'
import { getUsersById, checkUsernameExist } from '#model/users.mjs'

import socketManagerState from '#state/SocketManager.mjs'
import deviceState from '#state/device.mjs'
import { userTypesState } from '#state/userType.mjs'

socketManagerState.onDeviceClear(device_id => {
  // tiến hành xóa device data để giải phóng bộ nhớ
  delete deviceState[device_id]
  console.log('Đã dọn data của thiết bị: ', device_id)
})

export default function (io, socket, cookieParser) {
  function emitDeviceId(device_id, name, ...params) {
    // lấy danh sách
    let listSocketId = socketManagerState.getSocketsByDevice(device_id)
    // gửi thông báo
    listSocketId.map(socket_id => {
      io.to(socket_id).emit(name, ...params)
    })
  }
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
          socket.device_id = device_id
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

  socket.on('login', data => {
    // check xem đã có device hay chưa?
    if (socket.device_id && deviceState[socket.device_id]) {
      if (deviceState[socket.device_id].sessions.length > 0) {
        socket.emit('loginStatus', {
          status: 'false',
          msg: 'Đã có tài khoản đăng nhập trên thiết bị này. EL7',
        })
      } else {
        // tiến hành đăng nhập
        data = helper.crypt.decode(data)
        if (data && data.username && data.password) {
          let resultValidateUsername = usernameValidate(data.username)
          if (resultValidateUsername.success) {
            data.username = resultValidateUsername.data
            // validate password
            let resultValidatePassword = passwordValidate(data.password)
            if (resultValidatePassword.success) {
              // đã kiểm tra username và mật khẩu xong tiếp theo kiểm tra trong db xem có user đó hay không?
              checkUsernameExist(data.username).then(listUser => {
                if (listUser.size > 0) {
                  if (listUser.size > 1) {
                    // trùng username
                    socket.emit('loginStatus', {
                      status: 'false',
                      msg: 'Tài khoản không có quyền truy cập. EL6',
                    })
                  } else {
                    let userId = listUser.docs[0].id
                    let userInfo = listUser.docs[0].data()

                    let passDecode = helper.crypt.decode(userInfo.password)
                    if (passDecode === data.password) {
                      // tiến hành tạo session
                      createSessionModel(userId, socket.device_id).then(docSessionRef => {
                        deviceState[socket.device_id].sessions.push({
                          id: docSessionRef.id,
                          user_id: userId,
                          device_id: socket.device_id,
                          status: 1,
                        })

                        // lưu thông tin session và user vào deviceState
                        userInfo.id = userId
                        // bỏ 1 số trường trước khi thêm vào state username, password, createdAt, timestamp
                        delete userInfo.username
                        delete userInfo.password
                        delete userInfo.createdAt
                        delete userInfo.timestamp
                        // lấy roles của user
                        let userType = userTypesState[userInfo.usertype]
                        userInfo.roles = userType.roles
                        // lấy vai trò của người dùng trong hệ thống
                        userInfo.user_type_name = userType.name
                        deviceState[socket.device_id].users.push(userInfo)

                        // trả về kết quả
                        socket.emit('loginStatus', {
                          status: 'success',
                          msg: 'Đăng nhập thành công!',
                        })

                        // gửi thông tin đến tất cả các tab khác của device
                        emitDeviceId(socket.device_id, 'authGetInfo', deviceState[socket.device_id])
                      }).catch(() => {
                        socket.emit('loginStatus', {
                          status: 'false',
                          msg: 'Lỗi kết nối CSDL. EL9',
                        })
                      })
                    } else {
                      socket.emit('loginStatus', {
                        status: 'false',
                        msg: 'Vui lòng kiểm tra lại tài khoản hoặc mật khẩu. EL8',
                      })
                    }
                  }
                } else {
                  socket.emit('loginStatus', {
                    status: 'false',
                    msg: 'Vui lòng kiểm tra lại tài khoản hoặc mật khẩu. EL5',
                  })
                }
              })
            } else {
              socket.emit('loginStatus', {
                status: 'false',
                msg: resultValidatePassword.error + ' EL4',
              })
            }
          } else {
            socket.emit('loginStatus', {
              status: 'false',
              msg: resultValidateUsername.error + ' EL3',
            })
          }
        } else {
          socket.emit('loginStatus', {
            status: 'false',
            msg: 'Phương thức đăng nhập không hợp lệ! EL2',
          })
        }
      }
    } else {
      socket.emit('loginStatus', {
        status: 'false',
        msg: 'Phương thức đăng nhập không hợp lệ! EL1',
      })
    }
  })

  socket.on('logout', cb => {
    if (socket.device_id && deviceState[socket.device_id]) {
      if (deviceState[socket.device_id].sessions.length > 0) {
        // tiến hành đăng xuất
        // xóa session khỏi db
        deleteSessionModel(deviceState[socket.device_id].sessions[0].id)
          .then(() => {
            deviceState[socket.device_id].sessions = []
            deviceState[socket.device_id].users = []

            // thông báo cho toàn bộ các tab khác thuộc device_id để cập nhật
            // lấy danh sách thiết bị
            emitDeviceId(socket.device_id, 'authGetInfo', deviceState[socket.device_id])
          }).catch(() => {
            cb('Lỗi kết nối CSDL! EO3')
          })
      } else {
        cb('Phương thức đăng xuất không hợp lệ! EO2')
      }
    } else {
      cb('Phương thức đăng xuất không hợp lệ! EO1')
    }
  })
}