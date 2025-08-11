import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const USERS = [
  { login: "admin", password: "admin123" },
  { login: "user1", password: "pass1" },
  { login: "user2", password: "pass2" },
  { login: "user3", password: "pass3" }
];

app.post("/login", (req, res) => {
  const { login, password } = req.body;

  const foundUser = USERS.find(
    (user) => user.login === login && user.password === password
  );

  if (foundUser) {
    res.status(200).json({
      success: true,
      user: { login: foundUser.login }
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Неверный логин или пароль"
    });
  }
});

app.listen(4000, () => {
  console.log("Запущен: http://localhost:4000");
});
