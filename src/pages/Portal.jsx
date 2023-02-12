import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { TextField, Box, Typography, Button, TableContainer, Paper, Table, TableBody, TableCell, TableRow, MenuItem, Backdrop, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import axios from 'axios';

import theme from '../helpers/theme';
import genderOptions from '../helpers/genderOptions';
import { userInfoRoute, updateUserInfoRoute, deleteUserRoute } from '../helpers/routes';
import SnackContext from '../contexts/SnackContext';

function Portal() {
  const navigate = useNavigate();
  const context = useContext(SnackContext);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    gender: ''
  })
  const [initialUserData, setInitialUserData] = useState()

  useEffect(() => {
    axios.get(userInfoRoute, {
      headers: { Authorization: `BEARER ${localStorage.getItem('accessToken')}` },
    })
      .then(res => {
        if (res.data.success) {
          setUserData(res.data.data)
          setInitialUserData(res.data.data)
          handleBackdropClose();
        }
        else {
          context.newSnack(true, 'error', res.data.message + ' Login again.')
          handleBackdropClose();
        }
      })
      .catch(err => {
        console.log(err);
        context.newSnack(true, 'error', 'Network Error.')
      })
  }, [])

  function handleUserDataChange(e) {
    const { name, value } = e.target;

    setUserData(prevData => {
      return ({ ...prevData, [name]: value, })
    });
  }

  function handleSaveClick() {
    if (initialUserData === userData) {
      context.newSnack(true, 'warning', 'No data change is made.')
      return;
    }

    toggleBackdrop();
    axios.put(updateUserInfoRoute, userData, {
      headers: { Authorization: `BEARER ${localStorage.getItem('accessToken')}` },
    }).then(res => {
      if (res.data.success) {
        context.newSnack(true, 'success', 'Successfully updated the details.')
        handleBackdropClose();
      }
      else {
        context.newSnack(true, 'error', res.data.message + ' Login again.')
        handleBackdropClose();
      }
    }).catch(err => {
      context.newSnack(true, 'error', 'Network Error')
    })
  }

  function handleLogout() {
    localStorage.removeItem('accessToken');

    navigate("/login")
  }

  function handleDeleteAccount() {
    toggleBackdrop();
    axios.delete(deleteUserRoute, {
      headers: { Authorization: `BEARER ${localStorage.getItem('accessToken')}` },
    }).then(res => {
      if (res.data.success) {
        navigate("/signup");
        handleBackdropClose();
      }
      else {
        context.newSnack(true, 'error', 'Error deleting your account. Try again later.')
      }
    }).catch(err => {
      context.newSnack(true, 'error', 'Network Error.')
    })
  }

  const [modalOpen, setModalOpen] = useState(false)
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [openBackdrop, setOpenBackdrop] = useState(true)
  function handleBackdropClose() {
    setOpenBackdrop(false);
  }
  function toggleBackdrop() {
    setOpenBackdrop(!openBackdrop);
  }

  return (
    <ThemeProvider theme={theme} >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Are you sure you want to delete your account?
          </Typography>

          <Box sx={{mt: 3}}>
            <Button variant="contained" color='success' sx={{margin: '0 10px 0 0'}} onClick={handleModalClose}>
              No
            </Button>
            <Button variant="contained" color='error' sx={{margin: '0 0 0 10px'}} onClick={handleDeleteAccount}>
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box
        component='form'
        className='p-6 text-center md:w-5/6 lg:w-3/5 m-auto'
      >
        <Typography variant="h2" gutterBottom className='text-white' >
          Portal
        </Typography>

        <TableContainer component={Paper}>
          <Table style={{ width: '100%' }}>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>
                  <TextField
                    size='small'
                    label='Name'
                    className='w-4/5'
                    name="name"
                    value={userData.name}
                    onChange={handleUserDataChange}
                  />
                </TableCell>

              </TableRow>

              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>{userData.email}</TableCell>
              </TableRow>


              <TableRow>
                <TableCell>Gender</TableCell>
                <TableCell>
                  <TextField
                    select
                    label="Gender"
                    size='small'
                    className='text-left w-4/5'
                    name="gender"
                    value={userData.gender}
                    onChange={handleUserDataChange}
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value} >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Delete Account</TableCell>
                <TableCell>
                  <Button variant="contained" startIcon={<DeleteIcon />} color='error' onClick={handleModalOpen}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          color='success'
          sx={{ margin: '20px' }}
          onClick={handleSaveClick}
        >
          Save
        </Button>
        <Button
          variant="contained"
          startIcon={<LogoutIcon />}
          color='warning'
          sx={{ margin: '20px' }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </ThemeProvider>
  )
}

export default Portal