import path from "path"
import { server, helper } from "afpk"

import config from './config/index.mjs'

import clientHomeController from './controller/client/home.mjs'

var { app, io } = server.create({
  express: {
    static: path.resolve('./public'), // path to static file
  },
  port: process.env.PORT || 10020, // default port
  onListen: () => { // event when server is running
    console.log(`Server is running on port ${process.env.PORT || 10020}`)
  }
})

/* API */
// cấp quyền truy cập
app.post('/api/auth-info', (req, res) => {
  res.json({
    status: 1,
    data: helper.crypt.encode(config.client.url_sysnc)
  })
})

// const docRef = db.collection('device').doc('aloha1');
// docRef.get().then((doc) => { console.log(doc.data()) })

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

// routing socket
io.on("connection", (socket) => {
  clientHomeController(socket, sockets)
});