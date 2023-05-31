"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose = require("mongoose");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const messagesRoute_1 = __importDefault(require("./routes/messagesRoute"));
const socket = require("socket.io");
const app = (0, express_1.default)();
require("dotenv").config();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: "30mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "30mb", extended: true }));
app.use(express_1.default.json());
app.use("/api/auth", userRoutes_1.default);
app.use("/api/messages", messagesRoute_1.default);
// mongoose.connect(
//   "mongodb+srv://Khushiig:<gupta2505>@cluster0.eu3sxox.mongodb.net/",{
//     useNewUrlParser: "true",
//     useUnifiedTopology: "true"
// process.env.MONGO_URL;
//   }
// );
// mongoose.connect(process.env.MONGO_URI);
mongoose
  .connect(
    "mongodb+srv://Khushiig:gupta2505@cluster0.eu3sxox.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: "true",
      useUnifiedTopology: "true",
    }
  )
  .then(() => {
    console.log("DB Connection Succesfull!");
  })
  .catch((err) => {
    console.log(err.message);
  });
// const server = app.listen(process.env.PORT, () => {
//     console.log(`Speak Lord!! Your server is running on Port ${process.env.PORT}`);
// });
const http = require("http");
const server = http.createServer(app);
server.listen(5000);
const cors = require('cors');
// const io = socket(server, {
//     cors: {
//         origin: ["*", "https://talku-talku-v3.vercel.app", "https://talku-talku-v3-server-5wgbjqivt-vinyl-davyl.vercel.app", "https://talku-talku-v3-server.vercel.app"],
//         credentials: false,
//     },
// });
app.use(cors());
const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
const io = socket(server, {
  cors: {
    origin:
      "* ",
      methods:["GET", "POST"],
    credentials: true,
  },
});
// const io = socket(server, {
//   cors: {
//     origin: "https://example.com",
//     methods: ["GET", "POST"],
//   },
// });
global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    });
});
// const http = require("http");
// const server = http.createServer(app);
// server.listen(PORT);
