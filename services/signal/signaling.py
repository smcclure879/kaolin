import sys
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
