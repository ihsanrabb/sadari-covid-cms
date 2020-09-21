import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '2rem',
    '& > *': {
      margin: theme.spacing(1),
      width: '50ch',
    },
  },
  button: {
    margin: theme.spacing(1),
  }
}));

const NewsForm = ({addOrEdit}) => {
  const classes = useStyles();
  const initialFieldValue = {
    title: "",
    description: "",
    date: ""
  }
  const [values, setValues] = useState(initialFieldValue)

  const handleInputChange = e => {
    const {name, value} = e.target
    setValues({
      ...values,
      [name] : value
    })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addOrEdit(values)
  }

  return (
    <>
      <h1>Sadari Covid CMS</h1>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleFormSubmit}>
        <TextField 
          label="Title" 
          variant="outlined"
          value={values.title}  
          name="title"
          onChange={handleInputChange}
        />
        <br/>
        <TextField 
          label="Tanggal" 
          variant="outlined"
          value={values.date}  
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
          value={values.description}
          name="description"
          onChange={handleInputChange}
        />
        <br/>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<SendIcon />}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </>
  )
}

export default NewsForm