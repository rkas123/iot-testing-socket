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
//-7
//-8 from server to client for alert
//all positive floats -> from arduino sending weight
let arduino_connected = false;
let weight = -9999;
wss.on("connection", function connection(ws) {
  console.log("A new client Connected!");
  console.log(wss.clients.size);
  const forWeight = () => {
    ws.send("-4");
  };

  //setInterval(forWeight, 10000);
  ws.on("close", () => {
    console.log(`Disconnected`);
    console.log(wss.clients.size);
  });

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    console.log(message.toString());
    let msg = message.toString();

    if (
      msg !== "-1" &&
      msg !== "-2" &&
      msg !== "-3" &&
      msg !== "-4" &&
      msg !== "-5" &&
      msg !== "-6" &&
      msg !== "-7" &&
      msg !== "-8"
    ) {
      let newWeight = parseFloat(msg);
      ws.send(msg);
      if (weight !== -9999) {
        if (weight - newWeight >= 100) {
          ws.send("-8");
          ws.send("-3");
        }
      }
      weight = newWeight;
    } else Broadcast(message.toString());
  });
});

const Broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

server.listen(PORT, () => console.log(`Lisening on port :${PORT}`));
