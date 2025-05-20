import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectRegisterError, selectRegisterLoading } from "./usersSlice.ts";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Button, TextField } from "@mui/material";
import { register } from "./usersThunks.ts";
import { toast } from "react-toastify";
import type { RegisterMutation } from "../../types";

const initialForm: RegisterMutation = {
  username: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const registerLoading = useAppSelector(selectRegisterLoading);
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterMutation>(initialForm);

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onSubmitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      toast.success("Registration is successful");
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
        Sign up
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={onSubmitFormHandler}
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              disabled={registerLoading}
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="family-name"
              value={form.username}
              onChange={onInputChange}
              helperText={getFieldError("username")}
              error={Boolean(getFieldError("username"))}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              disabled={registerLoading}
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={form.password}
              onChange={onInputChange}
              helperText={getFieldError("password")}
              error={Boolean(getFieldError("password"))}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              disabled={registerLoading}
              fullWidth
              name="confirmPassword"
              label="Confirm password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={onInputChange}
              helperText={getFieldError("confirmPassword")}
              error={Boolean(getFieldError("confirmPassword"))}
            />
          </Grid>
        </Grid>
        <Button
          disabled={registerLoading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid container justifyContent="space-between">
          <Grid sx={{ mx: "auto" }}>
            <Link to="/login" variant="body2" component={RouterLink}>
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Register;
