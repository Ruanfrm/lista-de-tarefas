// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Login from "./pages/Login";
import Config from "./pages/config/Config"
import Privete from "./routes/privete" 


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/listadeterefas",
    element: <Privete><Config/></Privete>,
  },
  
 
]);

export {router};
