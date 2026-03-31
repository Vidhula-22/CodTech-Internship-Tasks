const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let users = {};

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("join", (username) => {

    users[socket.id] = username;

    io.emit("systemMessage", username + " joined the chat");

  });

  socket.on("chatMessage", (msg) => {

    io.emit("chatMessage", {
      username: users[socket.id],
      message: msg
    });

  });

  socket.on("disconnect", () => {

    const username = users[socket.id];

    if (username) {
      io.emit("systemMessage", username + " left the chat");
      delete users[socket.id];
    }

  });

});

const PORT = 5001;

server.listen(PORT, () => {
  console.log("Chat server running on http://localhost:" + PORT);
});