/*import sys
from aiohttp import web
import socketio


room = 'room'

sio = socketio.AsyncServer(cors_allowed_origins='*', ping_timeout=35)
app = web.Application()
sio.attach(app)


@sio.event
async def connect(sid, environ):

    print('Connected'+repr(environ), sid)
    if  environ['REMOTE_ADDR'] != '127.0.0.1' :
        return

    #address = socket.handshake.address;
    #print('New connection from ' + address.address + ':' + address.port);

    await sio.emit('ready', room=room, skip_sid=sid)
    print('emitted')
    sio.enter_room(sid, room)
    print('entered')

@sio.event
def disconnect(sid):
    sio.leave_room(sid, room)
    print('Disconnected', sid)


@sio.event
async def data(sid, data):
    print('Message from {}: {}'.format(sid, data))
    await sio.emit('data', data, room=room, skip_sid=sid)

listenPort = 'fail'
room = 'room'

if __name__ == '__main__':
    listenPort = int(sys.argv[1])
    room = sys.argv[2]
    web.run_app(app, port=listenPort)
*/


const dumps = JSON.stringify;
const log = console.log;
//let args = process.argv;
//let port=args[2];  //  0 & 1 are nodejs and <this file> 
const io = require('socket.io')(5000);
const roomNameOk = /^\/[a-z]{4,8}$/;

const sig = io
      //.of('/chat')
      //.on('foobar', (x) => { alert("xyz"); })
      .on('connection', (socket) => {
	  log('bugbug0138a');
	  socket.on('data', (data) => {  //step2 the reply
	      log(dumps(data));
	      switch(data.type) {
	      case 'thisRoom': handleRoomChange(socket,data.roomName); break;
	      //case 'candidate': handleCandidate(socket,data.candidate); break;
	      //case 'offer': handleOffer(socket,data.sdp); break;
	      default: socket.to(data.roomName).emit('data',data);
	      }
	  })
	  socket.emit('whichRoom',{});   //step1 the query
	  log('bugbug0138d');
      })
      .on('disconnection', (socket) => {
	  log('bugbug0138c');
      });
	  



const handleRoomChange = (socket,probableRoomName) => {
    log('bugbug1201m='+probableRoomName);
    if (!roomNameOk.test(probableRoomName)) {
	log( "bugbug1855t-invalid room="+probableRoomName);
    }else{
	room=probableRoomName.substr(1);
	socket.join(room);
	socket.emit('ready',{});
    }
}
