// /backend/utils/socket.js
let io = null;

exports.setIO = (socketIOInstance) => {
  io = socketIOInstance;
};

exports.getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized!');
  return io;
};

