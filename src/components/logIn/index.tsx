import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";

function LogIn() {
  const {register, handleSubmit, formState: {errors}} = useForm()

  const onSubmit = (data) => {
    console.log("Login data", data)
  }

  return (
    <Box
    component="form"
    onSubmit={handleSubmit(onSubmit)}
    sx={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 2
    }}
    >
      Форма для входа
      <TextField
      label='Логин'
      {...register("login", { required: "Введите логин" })}
      error={!!errors.login}
      helperText={errors.login?.message}
      />
      <TextField
      label='Пароль'
      type="password"
      {...register("password", { required: "Введите пароль" })}
      error={!!errors.password}
      helperText={errors.password?.message}
      />
      <Button type="submit" variant="contained" color="primary">Войти</Button>
    </Box>
  )

}

export default LogIn;
