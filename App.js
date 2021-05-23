const express = require('express');
const util = require("util");
var http = require('http');
const {
    join
} = require('path');
const {
    emit
} = require('process');
const app = express();
const port = process.env.PORT || 3001;
var server = http.createServer(app);
const {
    v4: uuidV4
} = require('uuid');

var io = require("socket.io")(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

//Middleware
app.use(express.json());
// app.use(cors())



app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get("/:room", (req, res) => {
    res.render('index', {
        roomId: req.params.room
    })
})

var clientsList = {};
io.on("connection", (socket) => {
    console.log('Connected');

    // socket.on('join-room',(roomId,userId)=>{
    //     console.log(roomId,userId);
    // })
    console.log(socket.id + 'has joined');

    //MESSAGE EVENT
    socket.on('message', (msg) => {
        let targetId = msg.targetId;
        console.log("TARGET ID " + targetId);
        var obj_str = util.inspect(clientsList);
        console.log(obj_str);
        console.log("CLIENTSList " + clientsList);
        console.log("THIS IS THE TARGET ID " + clientsList[targetId]);
        console.log(msg);

        if (clientsList[targetId]) {

            clientsList[targetId].emit("message", {
                "sourceId": msg.sourceId,
                "message": msg.messageBody
            });
        }
    });

    //SIGN IN
    socket.on('signIn', (id) => {
        console.log("SIGN IN ID" + id);
        clientsList[id] = socket;
        console.log(clientsList[id]);
    });



    // socket.on("leave",(id)=>{
    //     socket.disconnect();
    //     clientsList = _.omit(clientsList,id);
    // })
})

server.listen(port, '0.0.0.0', () => {
    console.log('Server is running');
})