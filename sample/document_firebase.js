// mẫu bảng của 1 user

import topic from "#controller/topic.mjs"

// userCollection = []
let userDoc = {
  username: "", // tên đăng nhập
  password: "", // mật khẩu
  usertype: "", // loại tài khoản
  status: 1, // trạng thái tài khoản
  // 1 là active
  // 2 là đang bị khóa
  lock_info: {
    // thông tin khóa
    lock_time: "", // thời gian khóa dạng chuỗi
    lock_reason: "", // lý do khóa
    lock_by: "", // người khóa
  },

  name: "", // đây là tên hiển thị
  avatar: "", // đây là ảnh đại diện
  background: "", // đây là ảnh nền
  email: "", // email của user
  phone: "", // số điện thoại
  tags: [], // đây là danh sách tags

  // thông tin khác
  createdAt: "", // thời gian tạo
  timestamp: 0, // thời gian tạo dạng số để sắp xếp
}

// mẫu bảng tab
let tabDoc = {
  timestamp: 0, // thời gian tạo
  createdAt: "", // thời gian tạo dạng chuỗi
  closeAt: "", // thời gian đóng
  ip: "", // ip của tab
  ua: "", // user agent của tab
  device_id: "", // id của device
  ssid: "", // ssid của trình duyệt
  socket_id: "", // socket id của tab
}

// session
let sessionDoc = {
  user_id: "", // id của user
  device_id: "", // id của device
  status: 1, // trạng thái token
  // 1 là active
  // 2 là đã hết hạn
  // 3 là bị đăng xuất bởi thiết bị khác
  // 4 là tài khoản không khả dụng
  createdAt: "", // thời gian tạo
  timestamp: 0, // thời gian tạo dạng số để sắp xếp
}

// topic
let topicDoc = {
  timestamp: 0, // thời gian tạo dạng số để sắp xếp
  name: "", // tên topic
  slug: "", // slug của topic
  color: "", // màu của topic
  icon: "", // icon của topic
  createdAt: "", // thời gian tạo
}

// khối
let blockDoc = {
  timestamp: 0, // thời gian tạo dạng số để sắp xếp
  topic_id: "", // id của topic
  name: "", // tên topic
  slug: "", // slug của topic
  color: "", // màu của topic
  icon: "", // icon của topic
  createdAt: "", // thời gian tạo
}

// lớp
let classDoc = {
  timestamp: 0, // thời gian tạo dạng số để sắp xếp
  topic_id: "", // id của topic
  block_id: "", // id của block
  name: "", // tên topic
  slug: "", // slug của topic
  color: "", // màu của topic
  icon: "", // icon của topic
  createdAt: "", // thời gian tạo
}

// bài học
let lessonDoc = {
  timestamp: 0, // thời gian tạo dạng số để sắp xếp
  topic_id: "", // id của topic
  block_id: "", // id của block
  class_id: "", // id của class
  name: "", // tên topic
  img: "", // ảnh của lesson
  slug: "", // slug của topic
  color: "", // màu của topic
  icon: "", // icon của topic
  createdAt: "", // thời gian tạo
}

// tài liệu ppt
let pptDoc = {
  timestamp: 0, // thời gian tạo dạng số để sắp xếp
  lesson_id: "", // id của lesson
  button: {
    name: "", // tên của nút
    color: "", // màu
    icon: "", // icon của tài liệu
  }
}

// tài liệu pdf
let pdfDoc = {
  timestamp: 0, // thời gian tạo dạng số để sắp xếp
  lesson_id: "", // id của lesson
  button: {
    name: "", // tên của nút
    color: "", // màu
    icon: "", // icon của tài liệu
  }
}

// tài liệu md

let mdDoc = {
  timestamp: 0, // thời gian tạo dạng số để sắp xếp
  lesson_id: "", // id của lesson
  button: {
    name: "", // tên của nút
    color: "", // màu
    icon: "", // icon của tài liệu
  }
}