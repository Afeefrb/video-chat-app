import React, {useContext} from 'react';
import {SocketContext} from '../SocketContext';
import {makeStyles} from '@material-ui/core/styles';
import {Grid, Typography, Paper} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    video: {
        width: '550px',
        [theme.breakpoints.down('xs')]: {
          width: '300px',
        },
      },
      gridContainer: {
        justifyContent: 'center',
        [theme.breakpoints.down('xs')]: {
          flexDirection: 'column',
        },
      },
      paper: {
        padding: '10px',
        border: '2px solid black',
        margin: '10px',
      },
}) );

const VideoPlayer = () => {

    const {name, stream, call, callAccepted, callEnded, myVideo, userVideo } = useContext(SocketContext);

    const classes = useStyles();

    return (
        <Grid container className={classes.gridContainer}>
                 {
                    stream && (
                        <Paper className={classes.paper}>
                        <Grid item xs={12} md={6}>
                           <Typography variant="h5" gutterBottom>{name || "Name"}</Typography>
                           <video playsInline autoPlay muted ref={myVideo} className={classes.video} />
                       </Grid>
                   </Paper>
                    )
                }

                {
                    callAccepted && !callEnded && (
                    <Paper className={classes.paper}>
                                    <Grid item xs={12} md={6}>
                                {/* call.name >> Call */}
                                        <Typography variant="h5" gutterBottom>{call.name || "UserName"}</Typography>
                                        <video playsInline autoPlay ref={userVideo} className={classes.video} />
                                    </Grid>
                    </Paper>
                    )
                }
          

            

        </Grid>

    )
}

export default VideoPlayer
