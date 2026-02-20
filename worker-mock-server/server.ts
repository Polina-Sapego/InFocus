import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "public/images")));

const dataPath = path.join(__dirname, "data", "news.json");

interface NewsItem {
  id: number;
  image: string;
  title: string;
  tags: string[];
  description: string;
  content: string;
  date: string;
  author: string;
}

interface NewsData {
  news: NewsItem[];
}

app.get("/news", (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 4;

  const start = (page - 1) * limit;
  const end = start + limit;

  const raw = fs.readFileSync(dataPath, "utf-8");
  const jsonNews: NewsData = JSON.parse(raw);

  const sliced = jsonNews.news.slice(start, end);

  res.json({
    news: sliced,
    hasMore: end < jsonNews.news.length,
  });
});

const USERS = [
  { login: "admin", password: "admin123" },
  { login: "user1", password: "pass1" },
  { login: "user2", password: "pass2" },
  { login: "user3", password: "pass3" },
];

app.post("/login", (req: Request, res: Response) => {
  const { login, password } = req.body;

  const foundUser = USERS.find(
    (user) => user.login === login && user.password === password
  );

  if (foundUser) {
    res.status(200).json({
      success: true,
      user: { login: foundUser.login },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Неверный логин или пароль",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Запущен: http://localhost:${PORT}`);
});
