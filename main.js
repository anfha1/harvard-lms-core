import { db } from './db/config.mjs'

const docRef = db.collection('device').doc('aloha1');
docRef.get().then((doc) => { console.log(doc.data()) })

// docRef.set({
//   firstName: 'John',
//   lastName: 'Doe',
//   age: 30
// })
// .then(() => {
//   console.log('Document written successfully!');
// })
// .catch((error) => {
//   console.error('Error writing document: ', error);
// });

// import cors from "cors"
// import path from "path"
// import axios from 'axios'
// import { server } from "afpk"
// import { socketio, api, ctrl } from './core/controller.mjs'

// var { express, http, app, io } = server.create({
//   cors: {
//     origin: 'https://giaoducharvard.edu.vn/'
//   }
// })
// const PORT = process.env.PORT || 7200

// let path_ui = path.resolve('./public')

// app.use(express.json())
// app.use(cors())

// // Serve static files (nếu cần)
// app.use(express.static(path_ui));

// /* API */
// app.post('/api/user/info', ctrl)
// app.post('/api/login', ctrl)
// app.post('/api/session/get', ctrl)
// app.post('/api/session/check', ctrl)
// app.post('/api/logout', ctrl)
// app.post('/api/blog', ctrl)
// app.post('/api/blog1', ctrl)
// app.post('/api/feedback', ctrl)
// app.post('/api/blog/role/check', ctrl)
// app.post('/api/course', ctrl)
// app.post('/api/course/ppt/get-data', ctrl)
// app.post('/api/book', ctrl)
// app.post('/api/action', ctrl)
// app.post('/api/action/get-data', ctrl)
// app.post('/api/advise', ctrl)
// app.post('/api/advise/get-data', ctrl)
// app.post('/api/category/search', ctrl)
// app.post('/api/manage/user', ctrl)
// app.post('/api/manage/user/create', ctrl)
// app.post('/api/manage/user/edit', ctrl)
// app.post('/api/manage/user/delete', ctrl)
// app.post('/api/manage/user/lock', ctrl)
// app.post('/api/manage/user/active', ctrl)
// app.post('/api/manage/blog', ctrl)
// app.post('/api/manage/blog/select', ctrl)
// app.post('/api/manage/blog/show', ctrl)
// app.post('/api/manage/blog/off', ctrl)
// app.post('/api/manage/blog/get-data', ctrl)
// app.post('/api/manage/blog/create', ctrl)
// app.post('/api/manage/blog/edit', ctrl)
// app.post('/api/manage/blog/delete', ctrl)
// app.post('/api/manage/course', ctrl)
// app.post('/api/manage/course/role/get', ctrl)
// app.post('/api/manage/course/role/set', ctrl)
// app.post('/api/manage/course/show', ctrl)
// app.post('/api/manage/course/off', ctrl)
// app.post('/api/manage/course/create', ctrl)
// app.post('/api/manage/course/edit', ctrl)
// app.post('/api/manage/course/delete', ctrl)
// app.post('/api/manage/course/session/create', ctrl)
// app.post('/api/manage/course/session/edit', ctrl)
// app.post('/api/manage/course/session/show', ctrl)
// app.post('/api/manage/course/session/off', ctrl)
// app.post('/api/manage/course/session/delete', ctrl)
// app.post('/api/manage/course/ppt/upload', ctrl)
// app.post('/api/manage/course/ppt/delete', ctrl)
// app.post('/api/manage/course/pdf/upload', ctrl)
// app.post('/api/manage/course/pdf/delete', ctrl)
// app.post('/api/manage/book', ctrl)
// app.post('/api/manage/book/role/get', ctrl)
// app.post('/api/manage/book/role/set', ctrl)
// app.post('/api/manage/book/show', ctrl)
// app.post('/api/manage/book/off', ctrl)
// app.post('/api/manage/book/create', ctrl)
// app.post('/api/manage/book/edit', ctrl)
// app.post('/api/manage/book/delete', ctrl)
// app.post('/api/manage/book/session/create', ctrl)
// app.post('/api/manage/book/session/edit', ctrl)
// app.post('/api/manage/book/session/show', ctrl)
// app.post('/api/manage/book/session/off', ctrl)
// app.post('/api/manage/book/session/delete', ctrl)
// app.post('/api/manage/book/pdf/upload', ctrl)
// app.post('/api/manage/book/pdf/delete', ctrl)
// app.post('/api/manage/action', ctrl)
// app.post('/api/manage/action/role/get', ctrl)
// app.post('/api/manage/action/role/set', ctrl)
// app.post('/api/manage/action/show', ctrl)
// app.post('/api/manage/action/off', ctrl)
// app.post('/api/manage/action/create', ctrl)
// app.post('/api/manage/action/edit', ctrl)
// app.post('/api/manage/action/delete', ctrl)
// app.post('/api/manage/action/session/create', ctrl)
// app.post('/api/manage/action/session/edit', ctrl)
// app.post('/api/manage/action/session/show', ctrl)
// app.post('/api/manage/action/session/off', ctrl)
// app.post('/api/manage/action/session/delete', ctrl)
// app.post('/api/manage/advise', ctrl)
// app.post('/api/manage/advise/role/get', ctrl)
// app.post('/api/manage/advise/role/set', ctrl)
// app.post('/api/manage/advise/show', ctrl)
// app.post('/api/manage/advise/off', ctrl)
// app.post('/api/manage/advise/create', ctrl)
// app.post('/api/manage/advise/edit', ctrl)
// app.post('/api/manage/advise/delete', ctrl)
// app.post('/api/manage/advise/session/create', ctrl)
// app.post('/api/manage/advise/session/edit', ctrl)
// app.post('/api/manage/advise/session/show', ctrl)
// app.post('/api/manage/advise/session/off', ctrl)
// app.post('/api/manage/advise/session/delete', ctrl)
// app.post('/api/manage/feedback', ctrl)
// app.post('/api/loguseractivity/create-many-async', api.loguseractivity)
// app.post('/api/tiny/upload', ctrl)

// app.get('/ppt/{ppt_id}/{session_id}.html', ctrl);
// app.get('/view/doc/{course_slug}-{course_id}/{session_slug}-{session_id}.html', ctrl)
// app.get('/view/book/{course_slug}-{course_id}/{session_slug}-{session_id}.html', ctrl)

// app.get('/Base/CheckLangCookie', ctrl)
// app.get('/Banner/GetBannerAdvertisement', ctrl)

// /* Web */
// app.get("*", (req, res) => {
//   res.sendFile(path.join(path_ui, "index.html"));
// });
// var sockets = []
// // Lắng nghe kết nối Socket.IO
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   next()
//   axios.post('http://127.0.0.1:' + PORT + '/api/session/check', {
//     token,
//   }, {
//     headers: {
//       laravel_session: 'WsSocketIoHarvard',
//     }
//   })
//   .then(({ data }) => {
//     if (data.status) {
//       sockets.push({
//         id: socket.id,
//         session_id: data.session,
//         user_id: data.id_user,
//         user_role: data.role_user,
//       })
//       update_online()
//       next()
//     } else {
//       next(new Error("invalid"));
//     }
//   })
//   .catch(() => {
//     next(new Error("invalid"));
//   });
// })
// io.on("connection", (socket) => {
//   socketio(socket, sockets)
// });

// http.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })