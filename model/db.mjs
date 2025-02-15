import admin from 'firebase-admin'

import config from './config/index.mjs'

// Khởi tạo Firebase Admin SDK với thông tin xác thực của dự án
admin.initializeApp({
  credential: admin.credential.cert(`./data/fixed/${config.frirebaseAdmin.file}`),
  databaseURL: config.frirebaseAdmin.name
});

// Lấy tham chiếu đến Firestore
const db = admin.firestore()
export default db