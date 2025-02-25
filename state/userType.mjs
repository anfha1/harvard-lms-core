// 1 user có thể có nhiều device nhưng 1 device chỉ thuộc về 1 user

// viết command để tạo tài khoản
// thông tin của 1 user gồm có username, password, email, sdt, địa chỉ, ngày sinh, giới tính, avatar, role, status, createdAt, updatedAt
// userType là 1 db riêng chứa các role gồm id và roles là một mảng
// rolesState chứa các mô tả về quyền của từng role
export const rolesState = {
  // quản lý người dùng
  u1: 'Thêm người dùng',
  u2: 'Cập nhật người dùng', // không bao gồm quyền cấp quyền, thay đổi mật khẩu và khóa tài khoản, chỉ có thể cập nhật thông tin cá nhân
  u3: 'Xóa người dùng',
  u4: 'Cấp quyền', // lựa chọn userType cho user
  u5: 'Khóa tài khoản', // thay đổi status của user
  u6: 'Thay đổi mật khẩu',
  u7: 'Gửi thông báo đến người dùng',

  // quản lý topic
  t1: 'Thêm topic',
  t2: 'Cập nhật topic',
  t3: 'Xóa topic',

  // quản lý Khối
  k1: 'Thêm Khối',
  k2: 'Cập nhật Khối',
  k3: 'Xóa Khối',

  // quản lý Lớp
  l1: 'Thêm Lớp',
  l2: 'Cập nhật Lớp',
  l3: 'Xóa Lớp',

  // quản lý giáo trình
  gt1: 'Thêm giáo trình',
  gt2: 'Cập nhật thông tin giáo trình',
  gt3: 'Xóa giáo trình',
  gt4: 'Cập nhật nội dung giáo trình', // mặc định có quyền này thì được xem giáo trình
  gt5: 'Cấp quyền xem giáo trình',

  // quản lý tin tức
  n1: 'Thêm tin tức',
  n2: 'Cập nhật tin tức',
  n3: 'Xóa tin tức',
  n4: 'Cập nhật trạng thái tin tức',

  a1: 'Cập nhật thông tin doanh nghiệp',
}

export const userTypesState = {
  admin: {
    name: 'Quản trị viên',
    roles: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 't1', 't2', 't3', 'k1', 'k2', 'k3', 'l1', 'l2', 'l3', 'gt1', 'gt2', 'gt3', 'gt4', 'gt5', 'n1', 'n2', 'n3', 'a1'],
  },
  // người quản lý tài khoản
  userManager: {
    name: 'Quản lý người dùng',
    roles: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7'],
  },
  // người xây dựng khung chương trình
  curriculumArchitect: {
    name: 'Người xây dựng khung chương trình',
    roles: ['t1', 't2', 't3', 'k1', 'k2', 'k3', 'l1', 'l2', 'l3', 'gt1', 'gt2', 'gt3', 'gt4', 'gt5'],
  },
  // người quản lý nội dung
  contentPublisher: {
    name: 'Người đăng tải nội dung',
    roles: ['gt4'],
  },
  learningAccessManager: {
    name: 'Người quản lý quyền truy cập học tập',
    roles: ['gt5'],
  },
  // người quản lý tin tức
  newsManager: {
    name: 'Người quản lý tin tức',
    roles: ['n1', 'n2', 'n3'],
  },
  // người bình thường không có quyền
  user: {
    name: 'Người dùng',
    roles: [],
  }
}