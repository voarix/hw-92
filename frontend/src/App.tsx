import { Container, CssBaseline, Typography } from "@mui/material";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import Register from "./features/users/Register.tsx";
import Login from "./features/users/Login.tsx";

const App = () => {
  return (
    <>
      <>
        <CssBaseline />
        <ToastContainer autoClose={1000} />
        <header></header>
        <main>
          <Container maxWidth="xl">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="*"
                element={<Typography variant="h4">Not found page</Typography>}
              />
            </Routes>
          </Container>
        </main>
      </>
    </>
  );
};

export default App;
