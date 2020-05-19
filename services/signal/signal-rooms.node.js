const listenPort = 5000;
let room="--uninit--"
const dumps = JSON.stringify;
const log = console.log;
const io = require('socket.io')(listenPort);


io.on('connection', (socket) => {    

    log('Connected '+socket.id + "   " + dumps(socket.request.connection.remoteAddress) );

    //we shouldn't answer calls from not our server, this'll change later.  
    if (socket.request.connection.remoteAddress != '::ffff:127.0.0.1' ) {
        socket.close();
    }
    
    socket.on('disconnect', () => {
	socket.leave(room);
	log('Disconnected ' + socket.id)
    });

    socket.on('data', (data) => {
	//log('Message from {'+socket.id+'}: {'+dumps(data)+'}');
	socket.to(room).emit('data', data);
    });

    socket.on('thisRoom', (newRoom) => {
	//bugbug verify room OK
	newRoom=newRoom.substr(1);  //bugbug slash
	socket.leave(room);
	room=newRoom;
	socket.join(newRoom);
	socket.emit('ready');
    });
    
    socket.emit('whichRoom');
    log('bugbug0131d');
    
});
    

