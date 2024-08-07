import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import Home from "./pages/Home/index";

function App() {
  const navigate = useNavigate();

  function ProtectedRoute({ isAuthenticated, children }) {
    if (!isAuthenticated) {
      navigate("/login");
    }
    return children;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Register></Register>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={true}>
              <Home></Home>
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
