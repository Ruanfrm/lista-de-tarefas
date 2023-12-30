import React from 'react';
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import {auth} from "../services/conectionfirebase"
import LogoutConfirmationModal from './LogoutConfirmationModal'
import AboutUs from './AboutUs';

const Navbar = () => {

    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isAboutUsOpen, setAboutUsOpen] = useState(false);


    const handleLogout = () => {
        // Abra o modal de confirmação
        setLogoutModalOpen(true);
      };

    
    const handleLogoutConfirm  = async () => {
        try {
          await auth.signOut();
          console.log('Logout bem-sucedido');
        } catch (error) {
          console.error('Erro ao fazer logout:', error.message);
        }
        setLogoutModalOpen(false);

      };

      const handleLogoutCancel = () => {
        // Feche o modal sem efetuar o logout
        setLogoutModalOpen(false);
      };

      const handleOpenAboutUs = () => {
        setAboutUsOpen(true)
      }

      const aboutusOpen = () => {
        setAboutUsOpen(true)
      }
      const aboutusClose = () => {
        setAboutUsOpen(false)
      }
  return (
    <AppBar position="static" style={{marginBottom: '3rem', background: 'transparent', color: 'black', borderRadius: '1rem', marginTop: '1rem'}} >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Lista de Tarefas
        </Typography>
        {/* <Button color="inherit">Home</Button> */}
        <Button color="inherit" onClick={handleOpenAboutUs}>Sobre</Button>
        <Button color="inherit" onClick={handleLogout}>Sair</Button>
      </Toolbar>
      <LogoutConfirmationModal
        open={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

        {/* componente AboutUs */}
        <AboutUs 
         open={isAboutUsOpen}
         onClose={aboutusClose}
        />

    </AppBar>
  );
};

export default Navbar;
