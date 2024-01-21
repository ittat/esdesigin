import { useState } from "react";
// import "./App.css";

import {
  BrowserRouter,
  Routes,
  Navigate,
  Route,
  Outlet,
} from "react-router-dom";
import { Provider } from "../Provider";

function App() {
  return (
    <Provider>
 
      <Outlet />

    </Provider>
  );
}

export default App;
