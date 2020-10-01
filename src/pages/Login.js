import React, { useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withRouter, Redirect } from 'react-router'
import { fb } from '../firebase'
import { AuthContext } from '../AuthContext'
import { useForm } from 'react-hook-form'
import Alert from '@material-ui/lab/Alert'
import Collapse from '@material-ui/core/Collapse'

const Login = ({history}) => {
  const { register, handleSubmit, errors } = useForm();
  const [errorAlert, setErrorAlert] = useState(false)

  const onLogin = (data) => {
    fb.auth().signInWithEmailAndPassword(data.email, data.password)
    .then(()=> {
      history.push("/")
    }).catch(err => {
      setErrorAlert(true)
      console.log(err)
      setTimeout(() => {
        setErrorAlert(false)
      }, 2000)
    })
  }

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Collapse in={errorAlert}>
        <Alert variant="filled" severity="error">
          Email or Password is incorrect 
        </Alert>
      </Collapse>
      <div className="login-wrap">
        <div className="form-wrap">
          <form autoComplete="off" onSubmit={handleSubmit(onLogin)}>
            <h1>LOGIN SADARI CMS</h1>
            <TextField 
              type="email" 
              label="Email" 
              variant="outlined" 
              name="email" 
              fullWidth={true} 
              className="m-2"
              inputRef={register({
                required: true
              })}
              error={errors.email ? true : false}
              helperText={errors.email && "Email is required"}
            />
            <br />
            <TextField 
              type="password" 
              label="Password" 
              variant="outlined" 
              name="password" 
              fullWidth={true} 
              className="m-2" 
              inputRef={register({
                required: true
              })}
              error={errors.password ? true : false}
              helperText={errors.pasword && "Password is required"}
            />
            <br />
            <Button variant="contained" color="primary" type="submit" size="large">
              Login
            </Button>
          </form>
          </div>
      </div>
    </>
  )
}

export default withRouter(Login)