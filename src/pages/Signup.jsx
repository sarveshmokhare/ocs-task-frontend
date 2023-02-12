import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Box, Typography, MenuItem, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';

import { signupRoute } from '../helpers/routes';
import SnackContext from '../contexts/SnackContext';
import theme from '../helpers/theme';
import genderOptions from '../helpers/genderOptions';

function Signup() {
    const navigate = useNavigate();
    const context = useContext(SnackContext);

    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: 'Select',
    })
    function handleUserDetailsChange(e) {
        const { name, value } = e.target;

        setUserDetails(prevData => {
            return ({ ...prevData, [name]: value, })
        });
    }

    const [detailsAreEmpty, setDetailsAreEmpty] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
        gender: false,
    })
    const [errText, setErrText] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
    })
    const [submitLoading, setSubmitLoading] = useState(false)
    function handleSubmit(e) {
        if (userDetails.name === '') {
            setDetailsAreEmpty(prevData => {
                return ({ ...prevData, name: true, })
            });
            setErrText(prevData => {
                return ({ ...prevData, name: 'This field should not be empty.', })
            });
            return;
        }
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
        if (userDetails.confirmPassword === '') {
            setDetailsAreEmpty(prevData => {
                return ({ ...prevData, confirmPassword: true, })
            });
            setErrText(prevData => {
                return ({ ...prevData, confirmPassword: 'This field should not be empty.', })
            });
            return;
        }
        if (userDetails.gender === '') {
            setDetailsAreEmpty(prevData => {
                return ({ ...prevData, gender: true, })
            });
            setErrText(prevData => {
                return ({ ...prevData, gender: 'This field should not be empty.', })
            });
            return;
        }
        if (userDetails.password !== userDetails.confirmPassword) {
            context.newSnack(true, 'error', "Passwords don't match.")
            return;
        }

        setSubmitLoading(true)
        axios.post(signupRoute, {
            name: userDetails.name,
            email: userDetails.email,
            password: userDetails.password,
            gender: userDetails.gender
        }).then(res => {
            if (res.data.success) {
                navigate("/login")
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
                    Signup
                </Typography>
                <TextField
                    label="Name"
                    variant="outlined"
                    size="small"
                    required
                    sx={{ margin: '10px', width: '80%' }}
                    onChange={handleUserDetailsChange}
                    name="name"
                    value={userDetails.name}
                    error={detailsAreEmpty.name}
                    helperText={errText.name}
                />
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
                <TextField
                    label="Confirm Password"
                    variant="outlined"
                    size="small"
                    required
                    sx={{ margin: '10px', width: '80%' }}
                    type='password'
                    onChange={handleUserDetailsChange}
                    name="confirmPassword"
                    value={userDetails.confirmPassword}
                    error={detailsAreEmpty.confirmPassword}
                    helperText={errText.confirmPassword}
                />

                <TextField
                    select
                    label="Gender"
                    size='small'
                    required
                    sx={{ margin: '10px', width: '80%' }}
                    className='text-left'
                    defaultValue="Select"
                    onChange={handleUserDetailsChange}
                    name='gender'
                    value={userDetails.gender}
                >
                    {genderOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value} >
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <LoadingButton
                    size="large"
                    loadingIndicator="Signing you in..."
                    variant="contained"
                    sx={{ marginTop: '10px', width: '80%' }}
                    color='success'
                    onClick={handleSubmit}
                    loading={submitLoading}
                >
                    <span>Submit</span>
                </LoadingButton>

                <Typography variant='subtitle2' sx={{ marginTop: '10px', }}>Already signed up? Login!</Typography>
                <Button
                    variant="outlined"
                    sx={{ width: '80%' }}
                    onClick={() => { navigate("/login") }}
                    color='warning'
                >
                    Login
                </Button>
            </Box>
        </ThemeProvider>

    )
}

export default Signup