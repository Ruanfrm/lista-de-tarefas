import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  set,
  remove,
  onValue,
} from "firebase/database";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { isValid, format } from "date-fns";
import Tooltip from "@mui/material/Tooltip";
import { FormControlLabel, Switch } from "@mui/material";
import Navbar from "../../components/NavBar";


const taskListStyle = {
  maxWidth: "1200px",
  margin: "0px auto",
  background: "#dfdfdf",
  marginTop: "100px",
  borderRadius: "10px",
  color: "#000",
};

const listItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px",
  marginBottom: "8px",
  borderRadius: "4px",
  border: "1px solid black",
};

const listItemTextStyle = {
  flex: 1,
  marginRight: "8px",
  maxWidth: "92%",
  wordWrap: "break-word",
  color: "#000",
};

const DEFAULT_TASK_CATEGORY = "Personal";
const DEFAULT_TASK_PRIORITY = "Medium";


const firebaseConfig = {
  apiKey: "AIzaSyAUYHcoYtrwXJNiXQIDhkI9eTZ2qm44caw",
  authDomain: "cardapiovirtual-d2d6b.firebaseapp.com",
  databaseURL: "https://cardapiovirtual-d2d6b-default-rtdb.firebaseio.com",
  projectId: "cardapiovirtual-d2d6b",
  storageBucket: "cardapiovirtual-d2d6b.appspot.com",
  messagingSenderId: "173010671308",
  appId: "1:173010671308:web:15fd5e2dea8851860a9469"
};

function Config() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDateTime, setTaskDateTime] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [editDateTime, setEditDateTime] = useState("");
  const [taskCategory, setTaskCategory] = useState(DEFAULT_TASK_CATEGORY);
  const [taskPriority, setTaskPriority] = useState(DEFAULT_TASK_PRIORITY);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editTask, setEditTask] = useState(null);

  const [showDateTimeInput, setShowDateTimeInput] = useState(false);
  const [showTimeReachedModal, setShowTimeReachedModal] = useState(false);



  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  useEffect(() => {
    const tasksRef = ref(database, "/tasks");

    onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val();
      if (tasksData) {
        const tasksArray = Object.values(tasksData);
        setTasks(tasksArray);
      }
    });

    loadCompletedTasksFromFirebase();

  }, []);

  const addTaskToFirebase = (taskData) => {
    const taskRef = push(ref(database, "tasks"));
    const taskId = taskRef.key;
    const taskDataWithId = { ...taskData, id: taskId };
    set(taskRef, taskDataWithId);
  };


  const addCompletedTaskToFirebase = (completedTask) => {
    const completedTaskRef = push(ref(database, "completed-tasks"));
    set(completedTaskRef, completedTask);
  };

  const loadTasksFromFirebase = () => {
    const tasksRef = ref(database, "tasks");
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const taskList = Object.values(data);
        setTasks(taskList);
      } else {
        setTasks([]);
      }
    });
  };

  useEffect(() => {
    loadTasksFromFirebase();
  }, []);

  const addTask = () => {
    if (editing) {
      if (newTaskContent.trim() !== "") {
        const updatedTasks = [...tasks];
        const updatedTask = {
          task: newTaskContent,
          dateTime: editDateTime,
          category: taskCategory,
          priority: taskPriority,
          id: tasks[editIndex].id,
        };
        updatedTasks[editIndex] = updatedTask;
        setTasks(updatedTasks);
        setEditing(false);
        setEditIndex(null);
        setNewTaskContent("");
        setEditDateTime("");
        setTaskCategory(DEFAULT_TASK_CATEGORY);
        setTaskPriority(DEFAULT_TASK_PRIORITY);
        const taskRef = ref(database, `tasks/${updatedTask.id}`);
        set(taskRef, updatedTask);
      }
    } else {
      if (newTask.trim() !== "") {
        const newTaskData = {
          task: newTask,
          dateTime: taskDateTime,
          category: taskCategory,
          priority: taskPriority,
        };
        setTasks((prevTasks) => [...prevTasks, newTaskData]);
        setNewTask("");
        setTaskDateTime("");
        setTaskCategory(DEFAULT_TASK_CATEGORY);
        setTaskPriority(DEFAULT_TASK_PRIORITY);
        addTaskToFirebase(newTaskData);
      }
    }
  };


  const removeTask = (taskId) => {
    removeTaskFromFirebase(taskId, "tasks");
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };


   const removeCompletedTask = (taskId) => {
    removeTaskFromFirebase(taskId, "completed-tasks");
    setCompletedTasks((prevCompletedTasks) =>
      prevCompletedTasks.filter((task) => task.id !== taskId)
    );
  };


  const showHistory = () => {
    setHistoryOpen(true);
  };

  const closeHistory = () => {
    setHistoryOpen(false);
  };

  const startEdit = (task) => {
    setEditTask(task);
    setNewTaskContent(task.task);
    setEditDateTime(task.dateTime);
    setTaskCategory(task.category);
    setTaskPriority(task.priority);
    setEditIndex(tasks.indexOf(task));
    setEditing(true);
  };


  const completeTask = (index) => {
    const completedTask = tasks[index];

    // Adiciona a tarefa completada ao histórico no Firebase
    addCompletedTaskToFirebase(completedTask);

    // Remove a tarefa de tasks no Firebase
    removeTaskFromFirebase(completedTask.id, "tasks");

    // Atualiza o estado local removendo a tarefa de tasks
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);

    // Notificar o usuário ou fazer outras ações necessárias ao completar a tarefa
  };


  const loadCompletedTasksFromFirebase = () => {
    const completedTasksRef = ref(database, "completed-tasks");
    onValue(completedTasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const completedTaskList = Object.values(data);
        setCompletedTasks(completedTaskList);
      } else {
        setCompletedTasks([]);
        
      }
    });
  };



  const removeTaskFromFirebase = (taskId, collection) => {
    const taskRef = ref(database, `${collection}/${taskId}`);
    remove(taskRef)
      .then(() => {
        console.log("Tarefa removida com sucesso");
      })
      .catch((error) => {
        console.error("Erro ao remover a tarefa:", error);
      });
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const checkTaskAlerts = () => {
      tasks.forEach((task) => {
        const taskDateTime = new Date(task.dateTime);
        if (isValid(taskDateTime) && taskDateTime <= new Date()) {
          setShowTimeReachedModal(true);
        }
      });
    };
  
    const alertInterval = setInterval(checkTaskAlerts, 1000 * 60); // Verifique a cada minuto
  
    return () => {
      clearInterval(alertInterval);
    };
  }, [tasks]);

  return (
    <Container style={taskListStyle}>
      <Navbar/>
      
      <TextField
        label="Nova Tarefa"
        variant="outlined"
        fullWidth
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        style={{ color: "#fff", marginBottom: "10px" }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={showDateTimeInput}
            onChange={() => setShowDateTimeInput(!showDateTimeInput)}
            color="primary"
          />
        }
        label="Incluir Data e Hora"
        style={{ margin: "10px 0" }}
      />
      {showDateTimeInput && (
        <>
          <TextField
            type="datetime-local"
            variant="outlined"
            fullWidth
            value={taskDateTime}
            onChange={(e) => setTaskDateTime(e.target.value)}
            style={{ color: "#fff" }}
          />
        </>
      )}
      <FormControl variant="outlined" fullWidth style={{ marginTop: "10px" }}>
        <InputLabel htmlFor="task-category">Categoria</InputLabel>
        <Select
          value={taskCategory}
          onChange={(e) => setTaskCategory(e.target.value)}
          label="Categoria"
          inputProps={{
            name: "category",
            id: "task-category",
          }}
        >
          <MenuItem value="Personal">Pessoal</MenuItem>
          <MenuItem value="Work">Trabalho</MenuItem>
          <MenuItem value="Shopping">Compras</MenuItem>
          <MenuItem value="Other">Outros</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" fullWidth style={{ marginTop: "10px" }}>
        <InputLabel htmlFor="task-priority">Prioridade</InputLabel>
        <Select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
          label="Prioridade"
          inputProps={{
            name: "priority",
            id: "task-priority",
          }}
        >
          <MenuItem value="Low">Baixa</MenuItem>
          <MenuItem value="Medium">Média</MenuItem>
          <MenuItem value="High">Alta</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={addTask}
        style={{ margin: "5px 0px" }}
      >
        {editing ? "Salvar Tarefa" : "Adicionar Tarefa"}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={showHistory}
        style={{ margin: "5px 10px" }}
      >
        Histórico
      </Button>
      <TextField
        label="Pesquisar Tarefas"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ color: "#fff", marginBottom: "10px" }}
      />
      <FormControl variant="outlined" fullWidth>
        <InputLabel htmlFor="filter">Filtrar</InputLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          label="Filtrar"
          inputProps={{
            name: "filter",
            id: "filter",
          }}
        >
          <MenuItem value="All">Todas</MenuItem>
          <MenuItem value="Low">Baixa Prioridade</MenuItem>
          <MenuItem value="Medium">Média Prioridade</MenuItem>
          <MenuItem value="High">Alta Prioridade</MenuItem>
        </Select>
      </FormControl>
      <List>
        {tasks
          .filter((task) => {
            if (filter === "All") return true;
            return task.priority === filter;
          })
          .filter((task) => task.task.includes(search))
          .map((task, index) => (
            <ListItem key={task.id || index} style={listItemStyle}>
              <ListItemText
                primary={
                  index === editIndex && editing ? (
                    <TextField
                      value={newTaskContent}
                      onChange={(e) => setNewTaskContent(e.target.value)}
                    />
                  ) : (
                    task.task
                  )
                }
                secondary={
                  index === editIndex && editing ? (
                    <TextField
                      type="datetime-local"
                      value={editDateTime}
                      onChange={(e) => setEditDateTime(e.target.value)}
                      style={{marginTop: '10px'}}

                    />
                  ) : task.dateTime && isValid(new Date(task.dateTime)) ? (
                    format(new Date(task.dateTime), "dd/MM/yyyy HH:mm")
                  ) : (
                    "Data não definida"
                  )
                }
                style={listItemTextStyle}
              />
              {index !== editIndex || !editing ? (
                <ListItemSecondaryAction>
                  <Tooltip title="Editar">
                    <IconButton edge="end" onClick={() => startEdit(task)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Deletar">
                    <IconButton edge="end" onClick={() => removeTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Finalizar">
                    <IconButton edge="end" onClick={() => completeTask(index)}>
                      <DoneAllIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              ) : (
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={addTask}>
                    <SaveIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
      </List>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "28px",
        }}
      >
        Lembrete de Tarefa{" "}
        <NotificationsActiveIcon
          style={{ margin: "0px 10px", fontSize: "larger" }}
        />
      </DialogTitle>
      <DialogContent style={{ fontSize: "20px" }}>
        <p>Tarefa: {selectedTask?.task}</p>
        <p>
          Data e Hora:{" "}
          {selectedTask
            ? format(new Date(selectedTask.dateTime), "dd/MM/yyyy HH:mm")
            : ""}
        </p>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenModal(false)} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>

    <p style={{textAlign: 'center', marginTop: '1rem', marginBottom: '1rem'}}>Feito por Ruan Freire </p>

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={closeSnackbar}
      message={snackbarMessage}
    />

    <Dialog open={showTimeReachedModal} onClose={() => setShowTimeReachedModal(false)}>
      <DialogTitle>Atenção!</DialogTitle>
      <DialogContent>
        <p>Uma tarefa atingiu a hora agendada.</p>
        {/* Você pode adicionar mais informações da tarefa aqui, se desejar */}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowTimeReachedModal(false)} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
   
  </Container>
  );
}

export default Config;
