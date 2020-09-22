import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {fb} from '../firebase'
import LinearProgress from '@material-ui/core/LinearProgress'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '2rem',
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  upload: {
    width: '100%'
  },
  input: {
    display: 'none'
  }
}));

const NewsForm = (props) => {
  const classes = useStyles();
  const initialFieldValue = {
    title: "",
    description: "",
    date: "",
    imageURL: ""
  }
  const [values, setValues] = useState(initialFieldValue)
  const [selectedFile, setSelectedFile] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(props.currentId === '') {
      setValues({
        title: "",
        description: "",
        date: "",
        imageURL: ""
      })
    } else {
      setValues({
        ...props.newsObj
      })
    }
  }, [props.currentId, props.newsObj])

  const handleInputChange = e => {
    const {name, value} = e.target
    setValues({
      ...values,
      [name] : value
    })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    props.addOrEdit(values)
    setSelectedFile('')
    clearField()
  }

  const clearField = (e) => {
    setValues({
      title: "",
      description: "",
      date: "",
      imageURL: ""
    })
    props.onClearField()
  }

  const onUpload = (event) => {
    let file = event.target.files[0];
    setLoading(true)
    setSelectedFile(file.name)

    let storageRef = fb.storage().ref('news/' + file.name + Date.now());
    let uploadTask = storageRef.put(file);
    uploadTask.on('state_changed', (snapshot) => {  
    }, (error) => {
      console.error(error)
    },() => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('img', downloadURL)
        setLoading(false)
        setValues({
          ...values,
          imageURL : downloadURL
        })
      });
    });

  }

  return (
    <>
      <h1>Sadari Covid CMS</h1>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleFormSubmit}>
        <TextField 
          label="Title" 
          variant="outlined"
          value={values.title || ''}  
          name="title"
          onChange={handleInputChange}
        />
        <br/>
        <TextField 
          label="Tanggal" 
          variant="outlined"
          value={values.date || ''}  
          name="date"
          onChange={handleInputChange}
        />
        <br />
        <TextField
          id="outlined-multiline-static"
          label="Description"
          multiline
          rows={4}
          variant="outlined"
          value={values.description || ''}
          name="description"
          onChange={handleInputChange}
        />
        <br/>

        {loading 
          ? <>
              <LinearProgress /> 
              <LinearProgress color="secondary" />
            </>
          : <>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={onUpload}
              />
              <label htmlFor="contained-button-file">
                <Button 
                  variant="contained" 
                  color="primary" 
                  component="span" 
                  fullWidth={true}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload
                </Button>
              </label>
            </>
        }

        {values.imageURL &&
          <img
            width="100%"
            className={classes.media}
            src={values.imageURL}
            alt="News"
          />
        }

        <p>{selectedFile}</p>

        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<DeleteIcon />}
              type="button"
              fullWidth={true}
              onClick={() => clearField()}
            >
              Clear
            </Button>
          </Grid>
          <Grid item xs={8}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<SendIcon />}
              type="submit"
              fullWidth={true}
            >
              {props.currentId === '' ? 'Submit' : 'Update'}
            </Button>
          </Grid>
        </Grid>

      </form>
    </>
  )
}

export default NewsForm