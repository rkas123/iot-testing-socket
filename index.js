const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server: server, path: "/" });

const PORT = process.env.PORT || 8000;
//Codes
//-1 from client saying to close
//-2 from client saying to open
//-3 from client saying to take photo
//-4 from client saying to send weight
//-5 from arduino saying door closed
//-6 from arduino saying door opened
//all positive floats -> from arduino sending weight
let arduino_connected = false;
wss.on("connection", function connection(ws) {
  console.log("A new client Connected!");
  console.log(wss.clients.size);
  ws.on("close", () => {
    console.log(`Disconnected`);
    console.log(wss.clients.size);
  });

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    console.log(message.toString());
    Broadcast(message.toString());
  });
});

const Broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

server.listen(PORT, () => console.log(`Lisening on port :${PORT}`));
