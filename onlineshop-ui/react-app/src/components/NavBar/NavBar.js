import React, {useContext} from 'react';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import AuthContext from "../../contexts/auth-context";


export default function NavBar() {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const handleHomeClick = async () => {
        navigate('/dashboard');
    }

    const handleLogoutClick = async () => {
        authContext.onLogout();
    }

  return (
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="static" sx={{backgroundColor: '#a0a1a1'}}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Button color='inherit' onClick={handleHomeClick}>Home</Button>
          <Button color="inherit" onClick={handleLogoutClick}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}