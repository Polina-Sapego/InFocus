import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { ensureUserExists, setCurrentUser } from "../userStorage";

function LogIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const response = await axios.post("http://localhost:4000/login", {
        login: data.login,
        password: data.password,
      });
      if (response.data.success) {
        ensureUserExists(data.login);
        setCurrentUser(data.login);
        navigate("/news");
      } else {
        setServerError("Неверный логин или пароль");
      }
    } catch (err) {
      const error = err as AxiosError;
      const status = error?.response?.status;

      if (status === 401) {
        setServerError("Неверный логин или пароль");
      } else {
        setServerError("Ошибка сервера");
      }
    }
  };

  return (
    <div className="login-page">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="login-form"
      >
        <h2 className="login-title">Log In</h2>

        <TextField
          label="Логин"
          {...register("login", { required: "Введите логин" })}
          error={!!errors.login}
          helperText={errors.login?.message}
        />

        <TextField
          label="Пароль"
          type="password"
          {...register("password", { required: "Введите пароль" })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        {serverError && (
          <div style={{ color: "red", marginBottom: "10px" }}>{serverError}</div>
        )}

        <Button type="submit" variant="contained" color="primary">
          Войти
        </Button>
      </Box>
    </div>
  );
}

export default LogIn;
