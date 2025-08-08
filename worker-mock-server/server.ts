import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const DEFAULT_LOGIN = "admin";
const DEFAULT_PASSWORD = "admin123";

app.post("/login", (req, res) => {
  const { login, password } = req.body;

  if (login === DEFAULT_LOGIN && password === DEFAULT_PASSWORD) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Неверный логин или пароль" });
  }
});

app.listen(4000, () => {
  console.log("Запущен: http://localhost:4000");
});
