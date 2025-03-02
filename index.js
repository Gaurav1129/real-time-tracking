const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("Connected");
    socket.on("send-location", (data) => {
        io.emit("recieve-location", {
            id: socket.id,
            ...data,
        });
    });
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    })
});


app.get("/", (req, res) => {
    res.render("index.ejs");
})

server.listen(8000, () => console.log(`Server is listening on port 8000`));