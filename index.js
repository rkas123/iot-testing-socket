const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
//const mongoose = require("mongoose");
//const Item = require("./models/item.js");
//app.use(express.json());

// mongoose.connect(
//   "mongodb+srv://rkas:ibkaJnq065BYgz8r@cluster0.zhbju.mongodb.net/dropBox?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//   }
// );

//password : ibkaJnq065BYgz8r
//username : rkas
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
//-9 Image Captured from arduino to all
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
    console.log(ws.id);
    if (
      msg !== "-1" &&
      msg !== "-2" &&
      msg !== "-3" &&
      msg !== "-4" &&
      msg !== "-5" &&
      msg !== "-6" &&
      msg !== "-7" &&
      msg !== "-8" &&
      msg !== "-9"
    ) {
      let newWeight = parseFloat(msg);
      newWeight = Math.abs(newWeight);
      ws.send(msg);
      if (weight !== -9999) {
        if (weight - newWeight >= 100) {
          ws.send("-8");
          ws.send("-3");
        }
      }
      weight = newWeight;
      Broadcast(weight);
    } else Broadcast(message.toString());
  });
});

const Broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

// app.get("/", async (req, res) => {
//   let currentTime = new Date();
//   let currentOffset = currentTime.getTimezoneOffset();
//   let ISTOffset = 330;

//   let currTime = new Date(
//     currentTime.getTime() + (ISTOffset + currentOffset) * 60000
//   );
//   const item = new Item({
//     name: "Hello",
//     time: new Date(currTime),
//   });

//   try {
//     await item.save();
//   } catch (err) {
//     console.log(err);
//   }
// });

server.listen(PORT, () => console.log(`Lisening on port :${PORT}`));

// app.listen(3001, () => {
//   console.log("running");
// });
