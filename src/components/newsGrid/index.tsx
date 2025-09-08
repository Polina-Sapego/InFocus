import React, { useEffect, useState } from "react";
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

const PAGE_SIZE = 4;

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

  const displayedNews = showFavorites
    ? news.filter(item => likes.includes(item.id))
    : news;

  const LikeableNewsTile = withLikeDecorator(React.memo(NewsTile));

  return (
    <div className="page-newsGrid">
      <div className="page-newsGrid-logo">
        <img src={Logo} className="logo-news" alt="logo" />
        <h1>inFocus</h1>
      </div>
      <div className="page-newsGrid-filter">
        <button className="page-newsGrid-like" onClick={() => likeHistory.undo()}>Отменить лайк</button>
        <button className="page-newsGrid-like" onClick={() => likeHistory.redo()}>Вернуть лайк</button>
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
