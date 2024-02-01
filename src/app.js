const express = require('express')
const handlebars = require('express-handlebars')
const {Server} = require('socket.io');
const viewsRouter = require('./routes/views.router')

const port = 3000;

const app = express()

app.engine('handlebars', handlebars.engine())
app.set('views',`${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use(express.static(`${__dirname}/public`))

app.use('/', viewsRouter);

const server = app.listen(port,()=>console.log(`Running on port ${port}`))

const messages = []
let userNames = []
const io = new Server(server);

io.on('connection',(socket)=>{
    console.log(`socket connencted`)

    socket.on('chatMessage',(message)=>{
        messages.push(message)
        io.emit('newMessage',{messages:messages})
    })

    socket.on('authenticated',({userName})=>{
        socket.userName = userName;
        userNames.push(userName);
        socket.broadcast.emit('newUser', {userName, userNames})
        io.emit('userList', {userNames})
    })

    socket.on('disconnect',()=>{
        userNames = userNames.filter(u=>u != socket.userName)
        io.emit('userList', {userNames})
    })
})