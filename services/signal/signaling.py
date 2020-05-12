from aiohttp import web
import socketio

ROOM = 'room'

sio = socketio.AsyncServer(cors_allowed_origins='*', ping_timeout=35)
app = web.Application()
sio.attach(app)


@sio.event
async def connect(sid, environ):
    print('Connected'+repr(environ), sid)
    if (environ['REMOTE_ADDR'] != '127.0.0.1'):
        return

    #address = socket.handshake.address;
    #print('New connection from ' + address.address + ':' + address.port);

    await sio.emit('ready', room=ROOM, skip_sid=sid)
    print('emitted')
    sio.enter_room(sid, ROOM)
    print('entered')

@sio.event
def disconnect(sid):
    sio.leave_room(sid, ROOM)
    print('Disconnected', sid)


@sio.event
async def data(sid, data):
    print('Message from {}: {}'.format(sid, data))
    await sio.emit('data', data, room=ROOM, skip_sid=sid)


if __name__ == '__main__':
    web.run_app(app, port=2999)
