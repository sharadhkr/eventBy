module.exports = (io) => {
  io.on("connection", (socket) => {

    socket.on("join:user", (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on("join:event", (eventId) => {
      socket.join(`event:${eventId}`);
    });

    socket.on("disconnect", () => {});
  });
};
