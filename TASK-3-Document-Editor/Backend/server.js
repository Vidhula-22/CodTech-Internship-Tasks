const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/docs");

// Schema
const Document = mongoose.model(
  "Document",
  new mongoose.Schema({
    _id: String,
    data: String,
  })
);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("get-document", async (id) => {
    socket.join(id);

    let document = await Document.findById(id);

    if (!document) {
      document = await Document.create({ _id: id, data: "" });
    }

    socket.emit("load-document", document.data);

    // RECEIVE changes
    socket.on("send-changes", (data) => {
      socket.broadcast.to(id).emit("receive-changes", data);
    });

    // SAVE document
    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(id, { data });
    });
  });
});

server.listen(5002, () => {
  console.log("Server running on port 5002");
});