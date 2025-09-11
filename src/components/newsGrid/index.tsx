import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import Logo from "@images/logoNews.png";
import NewsTile from "./NewsTile";
import { useLoaderData } from "react-router-dom";
import { INewGridItem } from "./NewsItem";
import { getCurrentUser } from "../../services/userStorage";
import { withLikeDecorator } from "./withLikeDecorator";
import { likeHistory } from "../../services/likeHistory";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useShowFavorites } from "../../hooks/useShowFavorites";
import { statsBuffer } from "../../services/statsCollector";

const PAGE_SIZE = 4;

type strategyType = "date" | "stats" | null;

function NewsGrid() {
  const loaderData = useLoaderData() as {
    news: INewGridItem[];
    hasMore: boolean;
    initialPage: number;
  };

  const [news, setNews] = useState(loaderData.news);
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [page, setPage] = useState(loaderData.initialPage);
  const [hasMore, setHasMore] = useState(loaderData.hasMore);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<number[]>(() => likeHistory.getLikes());
  const [showFavorites, setShowFavorites] = useShowFavorites();
  const [strategy, setStrategy] = useState<strategyType>(null);
  const [stats, setStats] = useState<Record<string, number>>({});

  const loadNews = async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/news", {
        params: { page: currentPage, limit: PAGE_SIZE }
      });

      setNews(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = res.data.news.filter(item => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });

      setHasMore(res.data.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Ошибка загрузки новостей", err);
    } finally {
      setLoading(false);
    }
  };

  const { observerRef } = useInfiniteScroll(() => loadNews(page), hasMore, loading);

  useEffect(() => {
    likeHistory.setActiveUser(getCurrentUser());

    return likeHistory.subscribe(() => {
      setLikes([...likeHistory.getLikes()]);
    });
  }, []);

  const LikeableNewsTile = withLikeDecorator(React.memo(NewsTile));

  const sortByData = (items: INewGridItem[]) =>
    [...items].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  function sortByClicks(newsItems: INewGridItem[], stats: Record<string, number>) {
    return [...newsItems].sort(
      (a, b) => (stats[b.id] || 0) - (stats[a.id] || 0)
    );
  }

  async function fetchStats() {
    const res = await fetch("http://localhost:3000/stats");
    return res.json();
  }

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (e) {
        console.error("Ошибка загрузки статистики", e);
      }
    }
    loadStats();
  }, []);

  const displayedNews = useMemo(() => {
    let result = showFavorites
      ? news.filter((item) => likes.includes(item.id))
      : news;

    switch (strategy) {
      case "date":
        result = sortByData(result);
        break;

      case "stats":
        result = sortByClicks(result, stats);
        break;

      default:
        break;
    }

    return result;
  }, [news, likes, showFavorites, strategy, statsBuffer]);

  return (
    <div className="page-newsGrid">
      <div className="page-newsGrid-logo">
        <img src={Logo} className="logo-news" alt="logo" />
        <h1>inFocus</h1>
      </div>
      <div className="page-newsGrid-filter">
        <label>
          Сортировать &nbsp;
          <select className="page-newsGrid-like" value={strategy ?? ""}
                  onChange={(e) => setStrategy(e.target.value as strategyType)}>
            <option value="">-выбрать-</option>
            <option value="date">по дате</option>
            <option value="stats">по популярности</option>
          </select>
        </label>
        <button className="page-newsGrid-like">Отменить лайк
        </button>
        <button className="page-newsGrid-like">Вернуть лайк
        </button>
        <button
          className="page-newsGrid-like"
          onClick={() => setShowFavorites(prev => !prev)}
        >
          {showFavorites ? "Показать все" : "Избранное"}
        </button>
      </div>
      <div className="page-newsGrid-list-news">
        {displayedNews.map((item, idx) => (
          <LikeableNewsTile
            key={item.id}
            newsItem={item}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            mockNewsItem={news[expandedId! - 2]}
            actualId={idx + 1}
          />
        ))}
      </div>
      {hasMore && !showFavorites && <div ref={observerRef} style={{height: "1px"}}/>}
    </div>
  );
}

export default NewsGrid;
