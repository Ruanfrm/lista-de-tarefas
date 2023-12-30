import React from 'react';
import { Container, TextField, Button, CssBaseline, Typography, Paper } from '@mui/material';
import Particles from 'react-tsparticles';

const LoginPage = () => {
  const handleLogin = () => {
    // Lógica de autenticação aqui
    console.log('Usuário autenticado!');
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Particles
        options={{
          background: {
            color: {
              value: '#282c34',
            },
          },
          fpsLimit: 60,
          interactivity: {
            detectsOn: 'canvas',
            events: {
              onClick: {
                enable: true,
                mode: 'push',
              },
              onHover: {
                enable: true,
                mode: 'repulse',
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: '#61dafb',
            },
            links: {
              color: '#61dafb',
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: 'none',
              enable: true,
              outMode: 'bounce',
              random: false,
              speed: 6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                value_area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: 'circle',
            },
            size: {
              random: true,
              value: 5,
            },
          },
          detectRetina: true,
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
      <Paper
        elevation={5}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: '#61dafb', color: '#fff' }}
          onClick={handleLogin}
        >
          Sign In
        </Button>
      </Paper>
    </Container>
  );
};

export default LoginPage;
