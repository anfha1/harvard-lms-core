import path from "path"
import admin from 'firebase-admin'

import config from '#config/index.mjs'

// Khởi tạo Firebase Admin SDK với thông tin xác thực của dự án
admin.initializeApp({
  credential: admin.credential.cert(path.resolve(`./data/fixed/key/${config.frirebaseAdmin.file}`))
});

// Lấy tham chiếu đến Firestore
const db = admin.firestore()
export default db