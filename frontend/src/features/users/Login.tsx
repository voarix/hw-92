import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectLoginError, selectLoginLoading } from "./usersSlice.ts";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Alert, Button, TextField } from "@mui/material";
import { login } from "./usersThunks.ts";
import { toast } from "react-toastify";
import type { LoginMutation } from "../../types";

const initialForm: LoginMutation = {
  username: "",
  password: "",
};

const Login = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const loginLoading = useAppSelector(selectLoginLoading);
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginMutation>(initialForm);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onSubmitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      toast.success("Login is successful");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>

      {error && <Alert severity="error">{error.error}</Alert>}

      <Box
        component="form"
        noValidate
        onSubmit={onSubmitFormHandler}
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              disabled={loginLoading}
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="family-name"
              value={form.username}
              onChange={onInputChange}
              error={!!error}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              disabled={loginLoading}
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={form.password}
              onChange={onInputChange}
              error={!!error}
            />
          </Grid>
        </Grid>
        <Button
          disabled={loginLoading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Grid container justifyContent="space-between">
          <Grid sx={{ mx: "auto" }}>
            <Link to="/register" variant="body2" component={RouterLink}>
              Don't have an account, yet? Sign up
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;
