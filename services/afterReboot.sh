#screen -S coturn -dm bash -c 'sleep 5; exec sh'
screen -dmS turn   bash -c "cd /root/gitstuff/kaolin/services/turn; echo coturn-in; ./runTurn; echo coturn-out; exec sh"
screen -dmS sig3k  bash -c "cd /root/gitstuff/kaolin/services/signal; echo sig1-in; python signal-pyth.py 3000; echo sig1-out; exec sh"
screen -dmS sig4k  bash -c "cd /root/gitstuff/kaolin/services/signal; echo sig2-in; python signal-pyth.py 4000; echo sig2-out; exec sh"
screen -dmS sig5k  bash -c "cd /root/gitstuff/kaolin/services/signal; echo sigRoom-in; nodejs signal-rooms.node.js 5000; echo sigRoom-out;exec sh"
nginx -s reload


