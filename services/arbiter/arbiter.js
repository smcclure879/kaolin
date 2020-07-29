//all these need to be set ahead of time....passed in?

const listenPort = 5555;
const redisHost = '127.0.0.1';


const redisPort = 6379;
let room="--uninit--"
const dumps = JSON.stringify;
const log = console.log;
const fs = require('fs');
const die = (x) => {
    log(x);
    process.exit(-18);
};


function readPasswordFile(filename,cb) { //cb=callback
    fs.readFile(filename, function (err, data ) {
	if (err) {	    die("cannot read password file: "+err);   	}
	if (!data) die("no password in file: "+filename);
	let retval = (""+data).trim();
	if (retval.length<3) die("password too short");
	cb(retval);
    });
};


const getTheTime = ()=>{
    //not too precise, don't give away that entropy source
    var seconds = new Date().getTime() / 1000;
    return seconds; 
};


const crypto = require('crypto');
const randU32Sync = () => {
    return crypto.randomBytes(4).readUInt32BE(0, true);
};
const serviceInstance = randU32Sync();
log("serviceInstance="+serviceInstance);

const main= (pwd)=>{
    
    //socketIO create
    const io = require('socket.io')(listenPort);

    //redis adaptor create
    const redis=require('redis');
    const redisAdapterFactory = require('socket.io-redis');
    const pub = redis.createClient(redisPort, redisHost, { auth_pass: pwd });
    const sub = redis.createClient(redisPort, redisHost, { auth_pass: pwd });
    const redisAdapter =  redisAdapterFactory( {
	port: redisPort,
	host: redisHost, 
	key:  'bugbuggreed',
	requestsTimeout: 5000,
	pubClient: pub,
	subClient: sub
    } );
    log("bugbug1936z");

    redisAdapter.pubClient.on('error', (x)=>{die("pub"+x);} );
    redisAdapter.subClient.on('error', (x)=>{die("sub"+x);} );
    /*
      key: the name of the key to pub/sub events on as prefix (socket.io)
      pubClient: optional, the redis client to publish events on
      subClient: optional, the redis client to subscribe to events on
      requestsTimeout: optional, after this timeout the adapter will stop waiting from responses to request (5000ms)
    */
    

    
    

    //tell socketio about redis
    io.adapter(redisAdapter);
    log("bugbug1938i");


    let townCrier=setInterval( (_)=> {
	//bugbug want this..... const broadcast = io.emit;  //to match up with socket.broadcast.....
	io.emit(  'data',  {datatype: 'timecode', timecode:getTheTime(), serviceInstance:serviceInstance}  );
    },5000);


    //Everything about connections and individual socks follows
    
    io.on('connection', (socket) => {
	log('Connected '+socket.id + "   " + dumps(socket.request.connection.remoteAddress) );

	log('headers: '+socket);
	//we shouldn't answer calls from not our server, NGINX should be intercepting them.
	if (socket.request.connection.remoteAddress != '::ffff:127.0.0.1' ) {
            socket.close();
	}
	socket.on('disconnect', () => {
	    socket.leave(room);
	    log('Disconnected ' + socket.id)
	});

	//bugbug neededqq
	// socket.on('data', (data) => {
	//     //log('Message from {'+socket.id+'}: {'+dumps(data)+'}');
	//     socket.to(room).emit('data', data);
	// });
	
	socket.on('login', (newRoom) => {
	    //skip color test entirely....we don't care...any room name is ok, we just don't color it.
	    if (! /^\/[0-9a-z\-_]{3,20}$/.test(newRoom)) {
		log("bad room test:"+newRoom);
		return;
	    }
	    newRoom=newRoom.substr(1);  //bugbug slash
	    socket.leave(room);
	    room=newRoom;
	    socket.join(newRoom);
	    socket.broadcast.emit('ready');
	});
	
	log('bugbug0131d');
	socket.emit("REQ_AUTH",{'serverSays':'bugbug1447u'});
	log('bugbug1431a');
    });
};

//feed password into the callback function "main" (to start everything)
readPasswordFile('./pwd_not_checked_in', main); 


