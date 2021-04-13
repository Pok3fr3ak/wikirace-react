import React from "react";
import io from 'socket.io-client';

export const socket = io('http://64.225.96.213',{transports: ['websocket']});

export const SocketContext = React.createContext(socket);

