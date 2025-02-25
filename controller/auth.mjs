import { helper } from "afpk"
import { usernameValidate, passwordValidate } from 'afpk/validator'

import { createSessionModel, deleteSessionModel } from '#model/sessions.mjs'
import { checkUsernameExist } from '#model/users.mjs'

import deviceState from '#state/device.mjs'
import { userTypesState } from '#state/userType.mjs'

export default function (socket) {
  socket.on('login', data => {
    // check xem đã có device hay chưa?
    if (socket.device.status) {
      if (deviceState[socket.device.id].sessions.length > 0) {
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
                      createSessionModel(userId, socket.device.id).then(docSessionRef => {
                        deviceState[socket.device.id].sessions.push({
                          id: docSessionRef.id,
                          user_id: userId,
                          device_id: socket.device.id,
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
                        deviceState[socket.device.id].users.push(userInfo)

                        // trả về kết quả
                        socket.emit('loginStatus', {
                          status: 'success',
                          msg: 'Đăng nhập thành công!',
                        })

                        // gửi thông tin đến tất cả các tab khác của device
                        socket.emitDevice(socket.device.id, 'authGetInfo', deviceState[socket.device.id])
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
    if (socket.device.status) {
      if (deviceState[socket.device.id].sessions.length > 0) {
        // tiến hành đăng xuất
        // xóa session khỏi db
        deleteSessionModel(deviceState[socket.device.id].sessions[0].id)
          .then(() => {
            deviceState[socket.device.id].sessions = []
            deviceState[socket.device.id].users = []

            // thông báo cho toàn bộ các tab khác thuộc device_id để cập nhật
            // lấy danh sách thiết bị
            socket.emitDevice(socket.device.id, 'authGetInfo', deviceState[socket.device.id])
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