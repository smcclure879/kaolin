//rewrite the simplest server in socket io, since complex one with multiroom didn't work yet

//bugbug later
//listenPort = sys.argv[2]
//room = sys.argv[3]
//const listenPort = 3000;

var room = 'room';
const dumps = JSON.stringify;
const log = console.log;
const io = require('socket.io')(5000);  //(app);


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
	log('why this never runs???? bugbug');
	log('Message from {'+socket.id+'}: {'+dumps(data)+'}');
	socket.to(room).emit('data', data);
    });

    socket.on( 'offer' ,  (x) => { log("offer x="+x); }  )
    
    socket.join(room);
    socket.emit('ready');

    log('ready&entered');
});
    

