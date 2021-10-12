import React, { useContext} from 'react';
import {Button} from '@material-ui/core'
import { SocketContext } from '../SocketContext';
import {Phone} from '@material-ui/icons'



const Notifications = () => {

    const {call, answerCall, callAccepted} = useContext(SocketContext);


    return (
        <>
            {
                call.isReceivingCall && !callAccepted && (
                    <div sytle={{display:"flex", justifyContent:"center"}}>
                        <h1> {call.name} is calling </h1>
                        <br/>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={answerCall}>
                              <Phone fontSize="large" /> &nbsp;  Answer
                        </Button>
                    </div>
                )
            }
        </>
    )
}

export default Notifications
