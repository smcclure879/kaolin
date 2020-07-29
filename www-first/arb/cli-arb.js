//client arbiter
// produced by ayvex for agreedis

// pull in code from third ayvex rooms conf


const userCan =  (auth)=>{
    //bugbug
    return true ;  //bugbug look up user record etc. in postgres?
};

const BuildArbiter =  ()=>{  //start encapsulation    
    let room=null;
    let socket=null;

    const login = (tempSocket, auth, cb) => {
	//do auth here with auth tokens...
	if (!userCan(auth)) {
	    log("fail auth");
	}
	room = "/debate-"+auth.debate;
	socket=tempSocket;
	socket.emit('login',room);
    };

    //auth={debate: 4380, randCode: '4a32s9-0412x3098u', loginTimeCode: 1094857142313, userId: 471 }}

    //arbiterURL shoudl look like   ="https://first.ayvexllc.com:5555"  ssl since login info is passed 
    const init =  ( arbiterUrl, auth, cb )  =>  {  //cb is mandatory
	const tempSocket = io(arbiterUrl, { autoConnect: false });
	tempSocket.on('connect_error', (err) => { log('did we get here.point5?'+err); } );  //bugbug added
	tempSocket.on('error', (err) => { log('did we get here.point6?'+err); } );  //bugbug added

	//The only way to the rest of program is thru login....
	tempSocket.on('REQ_AUTH', (msgObj)=>{
	    bugbug(1906,msgObj);
	    login(tempSocket,auth,cb)
	});
	tempSocket.on('data', (msgObj)=>{
	    bugbug('1410p',msgObj);

	});

	tempSocket.connect();
	bugbug(2205);
    };

    
    const tell =  (msgObj) => {
	socket.send(msgObj);
    };

    const onMsg = (cb) => {  //cb takes a msgObj
	if (!socket) return "ERROR: init first";
	return socket.on('data', (msgObj)=>{cb(msgObj)});  //bugbug "this" handling
    };
    
    return {  //PUBLIC METHODS  returned from encapsulation
	init:init,
	tell:tell,
	onMsg:onMsg
    };


    
};  //end encapsulation

