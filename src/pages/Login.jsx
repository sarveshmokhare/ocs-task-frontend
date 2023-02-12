import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Box, Typography, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';

import { loginRoute } from '../helpers/routes';
import SnackContext from '../contexts/SnackContext';
import theme from '../helpers/theme';

function Login() {
  const navigate = useNavigate();
  const context = useContext(SnackContext);

  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  })
  function handleUserDetailsChange(e) {
    const { name, value } = e.target;

    setUserDetails(prevData => {
      return ({ ...prevData, [name]: value, })
    });
  }
  const [detailsAreEmpty, setDetailsAreEmpty] = useState({
    email: false,
    password: false,
  })
  const [errText, setErrText] = useState({
    email: '',
    password: '',
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  function handleSubmit(e) {
    if (userDetails.email === '') {
      setDetailsAreEmpty(prevData => {
        return ({ ...prevData, email: true, })
      });
      setErrText(prevData => {
        return ({ ...prevData, email: 'This field should not be empty.', })
      });
      return;
    }
    if (userDetails.password === '') {
      setDetailsAreEmpty(prevData => {
        return ({ ...prevData, password: true, })
      });
      setErrText(prevData => {
        return ({ ...prevData, password: 'This field should not be empty.', })
      });
      return;
    }

    setSubmitLoading(true)
    axios.post(loginRoute, {
      email: userDetails.email,
      password: userDetails.password
    }).then(res => {
      if (res.data.success) {
        console.log(res.data.accessToken);
        localStorage.setItem('accessToken', res.data.accessToken)
        navigate("/portal")
      }
      else {
        context.newSnack(true, 'error', res.data.message)
      }
      setSubmitLoading(false)
    }).catch(err => {
      context.newSnack(true, 'error', 'Network error.')
      setSubmitLoading(false)
    })

  }

  return (
    <ThemeProvider theme={theme} >
      <Box
        component='form'
        className='p-6 text-center md:w-1/2 m-auto'
      >
        <Typography variant="h2" gutterBottom className='text-white'>
          Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          size="small"
          required
          sx={{ margin: '10px', width: '80%' }}
          type="email"
          onChange={handleUserDetailsChange}
          name="email"
          value={userDetails.email}
          error={detailsAreEmpty.email}
          helperText={errText.email}
        />
        <TextField
          label="Password"
          variant="outlined"
          size="small"
          required
          sx={{ margin: '10px', width: '80%' }}
          type='password'
          onChange={handleUserDetailsChange}
          name="password"
          value={userDetails.password}
          error={detailsAreEmpty.password}
          helperText={errText.password}
        />

        <LoadingButton
          size="large"
          loadingIndicator="Logging you in..."
          variant="contained"
          sx={{ marginTop: '10px', width: '80%' }}
          color='success'
          onClick={handleSubmit}
          loading={submitLoading}
        >
          <span>Submit</span>
        </LoadingButton>

        <Typography variant='subtitle2' sx={{ marginTop: '10px', }}>Didn't signup yet? Signup!</Typography>
        <Button
          variant="outlined"
          sx={{ width: '80%' }}
          onClick={() => { navigate("/signup") }}
          color='warning'
        >
          Signup
        </Button>
      </Box>
    </ThemeProvider>
  )
}

export default Login