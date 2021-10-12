import React, {useState, useEffect, useRef, createContext} from 'react';
import {io} from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();
//const socket = io("http://localhost:5000");
const socket = io("https://video-chat-app2.herokuapp.com/");

const ContextProvider = ({children}) => {

    const [stream, setStream] = useState(null);
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");



    const myVideo = useRef(); 
    const userVideo = useRef();
    const connectionRef = useRef();



   

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video:true, audio:true})
            .then((currentStream) => {
                setStream(currentStream);

                myVideo.current.srcObject = currentStream;

            })
        //listening for the "me" action emmiting from the server, we need to get the id
        socket.on("me", (id) => setMe(id));

        //name: callerName >> calling to name 
        //from >> caller

        socket.on("callUser", ({name: callerName, from, signal})=> {
            setCall({isReceivingCall:true, name: callerName, from, signal});
        })

    }, []);

    const callUser = (id) => {
        const peer = new Peer ({initiator:true, trickle:false, stream});

        peer.on("signal", (data) => {
            socket.emit("callUser", {userToCall: id, signalData:data, from: me, name})
        })

        peer.on("stream", (currentStream) => {
            userVideo.current.srcObject = currentStream;
        })

        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal)
        })

        connectionRef.current = peer;

    }

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer ({initiator:false, trickle:false, stream});

        peer.on("signal", (data) => {
            socket.emit("answerCall", {signal: data, to: call.from})
        })

        peer.on("stream", (currentStream) => {
            userVideo.current.srcObject = currentStream;
        })

        peer.signal(call.signal);

        //current connection is equal to the current connection inside the peer

        connectionRef.current = peer;


    }

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    }

    return (
        <SocketContext.Provider value={{stream, me, call, callAccepted, callEnded, name, setName, callUser, answerCall, leaveCall, myVideo, userVideo}}>
            {children}
        </SocketContext.Provider>
    );

}

export {SocketContext,ContextProvider}