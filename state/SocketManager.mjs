class SocketManagerState {
  constructor() {
    this.socketToDevice = new Map();  // socket_id -> { device_id, ssid }
    this.deviceToSockets = new Map(); // device_id -> Set(socket_id)
    this.ssidToDevice = new Map();    // ssid -> device_id
    this.deviceToSsid = new Map();    // device_id -> Set(ssid)
    this.eventOnDeviceClear = []
  }

  // Thêm kết nối
  addConnection(socket_id, device_id, ssid) {
    if (this.socketToDevice.has(socket_id)) return false; // Tránh trùng socket_id

    this.socketToDevice.set(socket_id, { device_id, ssid });

    // Cập nhật device -> socket_id
    if (!this.deviceToSockets.has(device_id)) {
      this.deviceToSockets.set(device_id, new Set());
    }
    this.deviceToSockets.get(device_id).add(socket_id);

    // Cập nhật ssid -> device_id
    this.ssidToDevice.set(ssid, device_id);

    // Cập nhật device -> ssid (để kiểm tra khi xóa)
    if (!this.deviceToSsid.has(device_id)) {
      this.deviceToSsid.set(device_id, new Set());
    }
    this.deviceToSsid.get(device_id).add(ssid);

    return true;
  }

  // Xóa kết nối khi socket disconnect
  removeConnection(socket_id) {
    if (!this.socketToDevice.has(socket_id)) return;

    const { device_id, ssid } = this.socketToDevice.get(socket_id);
    this.socketToDevice.delete(socket_id);

    // Xóa socket_id khỏi device -> socket
    if (this.deviceToSockets.has(device_id)) {
      this.deviceToSockets.get(device_id).delete(socket_id);
      if (this.deviceToSockets.get(device_id).size === 0) {
        this.deviceToSockets.delete(device_id); // Xóa device nếu không còn socket nào
      }
    }

    // Kiểm tra nếu không còn socket nào dùng ssid, thì xóa ssid khỏi bản đồ
    if (![...this.socketToDevice.values()].some(entry => entry.ssid === ssid)) {
      this.ssidToDevice.delete(ssid);
    }

    // Kiểm tra nếu không còn socket nào dùng device_id, thì xóa ssid liên quan
    if (!this.deviceToSockets.has(device_id)) {
      this.eventOnDeviceClear.map(cb => cb(device_id))
      this.deviceToSsid.delete(device_id);
    }
  }

  // Lấy device_id từ ssid
  getDeviceBySsid(ssid) {
    return this.ssidToDevice.get(ssid) || null;
  }

  // Lấy thông tin từ socket_id
  getInfoBySocket(socket_id) {
    return this.socketToDevice.get(socket_id) || null;
  }

  // Lấy danh sách socket từ device_id
  getSocketsByDevice(device_id) {
    return this.deviceToSockets.has(device_id) ? Array.from(this.deviceToSockets.get(device_id)) : [];
  }

  onDeviceClear(cb) {
    this.eventOnDeviceClear.push(cb)
  }
}

export default new SocketManagerState();