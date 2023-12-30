import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const AboutUs = ({ open, onClose,  }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Pra que serve?</DialogTitle>
      <DialogContent>
        <DialogContentText>
         O objetivo dessa lista de tarefas é que o usuario gerencie a sua gestão de tempo entre cada tarefa, tanto para uso pessoal, quanto profissional...
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
       
      </DialogActions>
    </Dialog>
  );
};

export default AboutUs;
