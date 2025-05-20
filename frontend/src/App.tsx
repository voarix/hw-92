import { Container, CssBaseline, Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import Register from "./features/users/Register";
import Login from "./features/users/Login";
import AppToolbar from "./components/UI/AppToolbar/AppToolbar";
import { useAppSelector } from "./app/hooks";
import { selectUser } from "./features/users/usersSlice";
import Chat from "./features/chat/Chat";
import ProtectedRoute from "./components/UI/ProtectedRoute.tsx";

const App = () => {
  const user = useAppSelector(selectUser);

  return (
    <>
      <>
        <CssBaseline />
        <ToastContainer autoClose={1000} />
        <header>
          <AppToolbar />
        </header>
        <main>
          <Container maxWidth="xl">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute isAllowed={Boolean(user)}>
                    <Chat />
                  </ProtectedRoute>
                }
              />

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
