import { getAllUsers } from '#model/users.mjs'
import { userTypesState } from '#state/userType.mjs'

export default function (socket) {
  socket.on('manageUserGetList', cb => {
    // kiểm tra quyền truy cập
    let res = {
      status: 0, // 0: thất bại, 1: thành công
      msg: '', // thông báo lỗi (nếu có)
      data: [] // danh sách người dùng (nếu có)
    }

    // check xem đã có device hay chưa?
    let roleCheck = socket.checkRole(['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7'], e => {
      switch (e) {
        case 400: {
          res.msg = 'Phương thức đăng nhập không hợp lệ. EMU1'
          break
        }
        case 400: {
          res.msg = 'Tính năng yêu cầu đăng nhập. EMU2'
          break
        }
        default: {
          res.msg = 'Không có quyền truy cập. EMU3'
          break
        }
      }
    })

    if (roleCheck) {
      // lấy danh sách người dùng
      getAllUsers().then(users => {
        users.forEach(user => {
          let userInfo = user.data()
          // chỉ lấy status, lock_info, name, avatar, email, phone, tags
          res.data.push({
            id: user.id,
            status: userInfo.status,
            lock_info: userInfo.lock_info,
            name: userInfo.name,
            avatar: userInfo.avatar,
            email: userInfo.email,
            phone: userInfo.phone,
            tags: userInfo.tags
          })
        })
        res.status = 1
        cb(res)
      }).catch(() => {
        res.msg = 'Lỗi kết nối CSDL. EMU4'
        cb(res)
      })
    } else {
      cb(res)
    }
  })

  socket.on('getUserType', cb => {
    cb(userTypesState)
  })
}