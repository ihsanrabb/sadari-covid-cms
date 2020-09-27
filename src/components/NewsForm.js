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
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Editor } from '@tinymce/tinymce-react';

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
  const { handleSubmit, errors, reset, control } = useForm({
    shouldFocusError: false,
    reValidateMode: 'onBlur',
  })

  useEffect(() => {
    let data = {
      title: props.newsObj.title,
      date: props.newsObj.date,
      sub_description: props.newsObj.sub_description,
      description: props.newsObj.description,
    }
    reset(data)
    setImgURL(props.newsObj.imageURL)
  }, [props.newsObj, reset])


  const handleFormSubmit = (data, e) => {
    console.log('tambah', data)
    if(imgURL) {
      let dataObj = {
        title: data.title,
        date: data.date,
        sub_description: data.sub_description,
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
          as={<TextField />}
          label="Judul"
          control={control}
          variant="outlined"
          defaultValue=""
          rules={{ required: true }}
          error={errors.title ? true : false}
          helperText={errors.title ? "Title wajib diisi" : ""}
        />
        <br/>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Controller 
            name="date"
            as={<DateTimePicker />}
            control={control}
            rules={{ required: true }}
            label="Tanggal"
            defaultValue={new Date()}
            inputVariant="outlined"
            ampm={false}
            error={errors.date ? true : false}
            helperText={errors.date ? "Tanggal dan Waktu wajib diisi" : ""}
          />
        </MuiPickersUtilsProvider>
        <br />

        <Controller 
          name="sub_description"
          as={<TextField />}
          label="Sub Description"
          multiline
          rows={2}
          variant="outlined"
          control={control}
          error={errors.sub_description ? true : false}
          helperText={errors.sub_description ? "Sub Deskripsi wajib diisi" : ""}
          rules={{ required: true }}
          defaultValue=""
        />
        <br/>

        <Controller 
          name="description"
          control={control}
          render={props => (
            <Editor 
              apiKey="cbe2lrk2sk58c61ttjie7d9slv3ydd8cpaq7gn2wyori4zuj"
              value={props.value || '<p>Description</p>'}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
              }}
              onEditorChange={props.onChange}
            />
          )}
          defaultValue=""
        />

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