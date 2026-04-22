import { io } from "socket.io-client";

const socket = io("https://civiclink-c5ov.onrender.com", {
  autoConnect: false, 
  transports: ["websocket"], 
});


// socket.connect();
// updated socket
export default socket;