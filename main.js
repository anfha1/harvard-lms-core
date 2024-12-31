import cors from "cors"
import path from "path"
import { server, Interact, Device } from "afpk"

import mongodb from './db/config.mjs'
import { create_tab, add_device, close_tab } from './db/tabs.mjs'
import { create_device, check_device } from './db/devices.mjs'

var { express, http, app, io } = server.create()
const PORT = process.env.PORT || 7200

let path_ui = path.resolve('./public')

app.use(express.json())
app.use(cors())

// Serve static files (nếu cần)
app.use(express.static(path_ui));

app.get("/", (req, res) => {
  res.json({ message: "Project 1!" });
});

// API endpoint mẫu
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the backend!" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(path_ui, "index.html"));
});

// Lắng nghe kết nối Socket.IO
io.on("connection", (socket) => {
  const interactService = new Interact(socket)
  const deviceService = new Device(interactService, mongodb, {
    create_tab, add_device, close_tab,
    create_device, check_device
  })
  deviceService.wait.on(() => {
    console.log(deviceService.device)
  })

  console.log("A user connected:", socket.id);

  // Nhận sự kiện từ client
  socket.on("message", (data) => {
    console.log("Received:", data);
    // Gửi lại cho tất cả các client
    io.emit("message", data);
  });

  // Xử lý ngắt kết nối
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})