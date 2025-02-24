// tạo tài khoản admin
import { helper } from 'afpk'
import { usernameValidate, passwordValidate } from 'afpk/validator'
import { createUsersModel, checkUsernameExist } from './model/user.mjs';

// lấy thông tin username, password từ command line
const userInfo = {
  name: process.argv[3],
  username: process.argv[3],
  password: process.argv[4],
  usertype: 'admin',
}

// validate username
let resultValidateUsername = usernameValidate(userInfo.username)
if (resultValidateUsername.success) {
  userInfo.username = resultValidateUsername.data
  // validate password
  let resultValidatePassword = passwordValidate(userInfo.password)
  if (resultValidatePassword.success) {
    // mã hóa luôn mật khẩu
    userInfo.password = helper.crypt.encode(resultValidatePassword.data)

    // kiểm tra tên tà khảon đã trùng hay chưa nếu trùng báo lỗi nếu chưa thì thêm tài khoản mới
    checkUsernameExist(userInfo.username).then((res) => {
      if (res.size > 0) {
        console.log('Tên tài khoản đã tồn tại')
      } else {
        let userRef = createUsersModel(userInfo)
        userRef.then((res) => {
          console.log('Thêm tài khoản thành công', userRef.id)
        })
          .catch((err) => {
            console.log('Thêm tài khoản thất bại')
          })
      }
    })
  } else {
    console.log("Lỗi:", resultValidatePassword.error)
  }
} else {
  console.log("Lỗi:", resultValidateUsername.error)
}