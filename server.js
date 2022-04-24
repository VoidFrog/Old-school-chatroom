let express = require('express')
let app = express()
let http = require('http')
const PORT = process.env.PORT || 3000

const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
//we create http server with express handling routing 
//and we create io instance with http server as an argument
//which makes possible to use socket io on the working http server



app.use(express.static('./'))

app.get('/', (req, res) => {
    res.send('index.html')
})

io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('chat message', (message) => {
        console.log(`message: ${message}`)

        socket.broadcast.emit('send_to_clients', `${message}`)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})


//delete ip in 2nd arg later 
server.listen(PORT,() => {
    console.log(`server listening on port ${PORT}`)
})
