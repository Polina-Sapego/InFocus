import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data', 'news.json');

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

interface NewsData { news: NewsItem[]; }

app.get('/news', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 4;
  const start = (page - 1) * limit;
  const end = start + limit;
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const json: NewsData = JSON.parse(raw);

  const sliced = json.news.slice(start, end);
  res.json({
    news: sliced,
    hasMore: end < json.news.length
  });
});

app.get('/news/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const json: NewsData = JSON.parse(raw);
  const item = json.news.find(n => n.id === id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.listen(PORT, () => {
  console.log(`Запущен: http://localhost:${PORT}`);
});
