import React, { useState, useEffect } from 'react'
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom';
import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';


const Form = ({ currentId, setCurrentId }) => {

    const [postdata, setPostdata] = useState({ title: '', message: '', tags: '', selectedFile: '' });
    const post = useSelector(state => currentId ? state.posts.posts.find((p) => p._id === currentId) : null);
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const history = useHistory();

    useEffect(() => {
        if (post)
            setPostdata(post);
    }, [post]);

    const clear = () => {
        setCurrentId(null);
        setPostdata({ title: '', message: '', tags: '', selectedFile: '' });
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentId) {
            dispatch(updatePost(currentId, { ...postdata, name: user?.result?.name }));
        } else {
            dispatch(createPost({ ...postdata, name: user?.result?.name },history));
            
        }
        clear();
    };

    if(!user?.result?.name){
        return(
            <Paper className={classes.paper}>
                <Typography variant="h6" aligb="center">
                    Please Sign In to create your own Posts and like other's Posts.
                </Typography>
            </Paper>
        )
    }
    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{currentId ? `Editing "${post.title}"` : 'Creating  a Memory'}</Typography>

                <TextField name="title" variant="outlined" label="Title" fullWidth value={postdata.title} onChange={(e) => setPostdata({ ...postdata, title: e.target.value })} />
                <TextField name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postdata.message} onChange={(e) => setPostdata({ ...postdata, message: e.target.value })} />
                {/* <textarea rows="4" cols="20" label="Message" value={postdata.message} onChange={(e) => setPostdata({ ...postdata, message: e.target.value })} ></textarea> */}
                <TextField name="tags" variant="outlined" label="Tags" fullWidth value={postdata.tags} onChange={(e) => setPostdata({ ...postdata, tags: e.target.value.split(',') })} />


                <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostdata({ ...postdata, selectedFile: base64 })} /></div>
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper>
    )
}
export default Form;