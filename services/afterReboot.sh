#screen -S coturn -dm bash -c 'sleep 5; exec sh'
screen -dmS turn   bash -c "cd /root/gitstuff/kaolin/services/turn; echo coturn-in; ./runTurn.sh; echo coturn-out; exec bash"
screen -dmS sig3k  bash -c "cd /root/gitstuff/kaolin/services/signal; echo sig1-in; python3 signal-pyth.py 3000 room3000; echo sig1-out; exec bash"
screen -dmS sig4k  bash -c "cd /root/gitstuff/kaolin/services/signal; echo sig2-in; python3 signal-pyth.py 4000 room4000; echo sig2-out; exec bash"
screen -dmS sig5k  bash -c "cd /root/gitstuff/kaolin/services/signal; echo sigRoom-in; nodejs signal-rooms.node.js 5000; echo sigRoom-out;exec bash"
nginx -s reload


