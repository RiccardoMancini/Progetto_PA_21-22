#!bin/sh

client1="ts-node usr/src/app/src/websockets/websocketclient.ts $1"
client2="ts-node usr/src/app/src/websockets/websocketclient.ts $2"
client3="ts-node usr/src/app/src/websockets/websocketclient.ts $3"

docker exec -it progetto_pa_21-22_web-node_1 sh -c "$client1; $client2; $client3";