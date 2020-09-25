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
import { useForm, Controller } from 'react-hook-form'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '2rem',
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  button: {
    textTransform: 'none'
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
  const [loading, setLoading] = useState(false)
  const [imgURL, setImgURL] = useState('')
  const { handleSubmit, errors, reset, control } = useForm()

  useEffect(() => {
    let data = {
      title: props.newsObj.title,
      date: props.newsObj.date,
      description: props.newsObj.description,
    }
    reset(data)
    setImgURL(props.newsObj.imageURL)
  }, [props.newsObj, reset])


  const handleFormSubmit = (data, e) => {
    if(imgURL) {
      let dataObj = {
        title: data.title,
        date: data.date,
        description: data.description,
        imageURL: imgURL
      }
      props.addOrEdit(dataObj)
      handleReset()
    } else {
      props.showAlert("Silahkan upload image terlebih dahulu", "error", false)
    }
  }

  const onUpload = (event) => {
    let file = event.target.files[0];
    setLoading(true)

    let storageRef = fb.storage().ref('news/' + Date.now() + file.name );
    let uploadTask = storageRef.put(file);
    uploadTask.on('state_changed', (snapshot) => {  
    }, (error) => {
      console.error(error)
    },() => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('img', downloadURL)
        setLoading(false)
        setImgURL(downloadURL)
      });
    });
  }

  const onDeleteImg = () => {
    let deleteImg = fb.storage().refFromURL(imgURL);

    deleteImg.delete().then(function() {
      console.log("image delete")
      setImgURL('')
    }).catch(function(error) {
      console.log("error delete image")
    })
  }


  const handleReset = () => {
    reset({ title: "", value: "", index: ""});
    setImgURL('')
    props.onClearField()
  };

  function buttonImg() {
    if(!imgURL) {
      return (
        <>
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
      )
    } else {
      return (
        <Button 
          variant="contained" 
          color="secondary" 
          component="span" 
          fullWidth={true}
          startIcon={<DeleteIcon />}
          onClick={() => onDeleteImg()}
        >
          Delete Image
        </Button>
      )
    }
  }

  return (
    <>
      <h1>Sadari Covid CMS</h1>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(handleFormSubmit)}>
        <Controller 
          name="title"
          as={({value, onChange}) => (
            <TextField 
              label="Title" 
              variant="outlined"
              name="title"
              value={value}
              onChange={e => {
                onChange(e.target.value);
              }}
              error={errors.title ? true : false}
              helperText={errors.title ? "title wajib diisi" : ""}
            />
          )}
          onChange={data => data}
          control={control}
          defaultValue=""
        />
        <br/>
        <Controller 
          name="date"
          as={({value, onChange}) => (
            <TextField 
              label="Tanggal" 
              variant="outlined"
              value={value}
              onChange={e => {
                onChange(e.target.value);
              }}
              error={errors.date ? true : false}
              helperText={errors.date ? "Tanggal wajib diisi" : ""}
            />
          )}
          onChange={data => data}
          control={control}
          defaultValue=""
        />
        <br />
        <Controller 
          name="description"
          as={({value, onChange}) => (
            <TextField
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              value={value}
              onChange={e => {
                onChange(e.target.value);
              }}
              error={errors.description ? true : false}
              helperText={errors.date ? "Deskripsi wajib diisi" : ""}
            />
          )}
          onChange={data => data}
          control={control}
          defaultValue=""
        />
        <br/>

        {loading 
          ? <>
              <LinearProgress /> 
              <LinearProgress color="secondary" />
            </>
          : buttonImg()
        }

        {imgURL &&
          <img
            width="100%"
            className={classes.media}
            src={imgURL}
            alt="News"
          />
        }

        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<DeleteIcon />}
              type="reset"
              fullWidth={true}
              onClick={handleReset}
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