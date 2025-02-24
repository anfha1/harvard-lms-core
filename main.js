import path from "path"
import { server, helper } from "afpk"

import config from './config/index.mjs'

import clientHomeController from './controller/client/home.mjs'

let path_ui = path.resolve('./public')
var { app, io, cookieParser } = server.create({
  express: {
    static: path_ui, // path to static file
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

/* Web */
app.get("*", (req, res) => {
  res.sendFile(path.join(path_ui, "index.html"));
});

// routing socket
io.on("connection", (socket) => {
  clientHomeController(io, socket, cookieParser)
});