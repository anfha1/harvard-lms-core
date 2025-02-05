import { Interact, Device } from "afpk"
import mongodb from './../db/config.mjs'
import { create_tab, add_device, close_tab } from './../db/tabs.mjs'
import { create_device, check_device } from './../db/devices.mjs'

export function ctrl(req, res) {
  res.json({ message: "Project 1!" });
}

export const api = {
  loguseractivity: (req, res) => {
    res.json({
      id: '1',
      succeeded: true,
    });
  }
}

export function socketio(socket, sockets) {
  socket.on('update_page', name => {
    socket_info = sockets.find(elm => elm.id == socket.id)
    if (socket_info && socket_info.user_role === 1) { // xác thực quyền người dùng đang test nên để true
      if (name == 'manage.user') {
        // gửi ngay danh sách online offline
        socket.emit('update_online', getListOnline())
        // thêm vào nhóm theo dõi
        socket.join("watch_online")
      } else {
        // nếu đang trong nhóm theo dõi thì bỏ ra
        socket.leave("watch_online")
      }
    }
  })

  socket.on('on_login', id_user => {
    id_user = Number(id_user)
    if (id_user) {
      let socket_info = sockets.find(elm => elm.id === socket.id)
      if (socket_info) {
        sockets = sockets.map(elm => {
          if (elm.id === socket.id) {
            elm.user_id = id_user
          } else if (elm.session_id === socket_info.session_id) {
            elm.user_id = id_user
          }
          return elm
        })
        update_online()
      }
    }
  })

  socket.on('on_logout', () => {
    let socket_info = sockets.find(elm => elm.id === socket.id)
    if (socket_info) {
      sockets = sockets.map(elm => {
        if (elm.id === socket.id) {
          elm.user_id = 0
        } else if (elm.session_id === socket_info.session_id) {
          elm.user_id = 0
        }
        return elm
      })
      update_online()
    }
  })

  socket.on("disconnect", () => {
    let index_socket = sockets.map(elm => elm.id).indexOf(socket.id)
    if (index_socket !== -1) {
      socket.leave("watch_online")
      sockets.splice(index_socket, 1)
      update_online()
    }
  });
}

function getListOnline() {
  let list_online = sockets.filter(elm => elm.user_id != 0).map(elm => elm.user_id)
  if (list_online.length > 1) {
    list_online = unique(list_online)
  }
  return list_online
}

function update_online() {
  io.to("watch_online").emit('update_online', getListOnline())
}

function unique(arr) {
  var formArr = arr.sort()
  var newArr = [formArr[0]]
  for (let i = 1; i < formArr.length; i++) {
    if (formArr[i] !== formArr[i - 1]) {
      newArr.push(formArr[i])
    }
  }
  return newArr
}