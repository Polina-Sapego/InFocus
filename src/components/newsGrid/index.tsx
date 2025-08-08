import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Logo from "@images/logoNews.png";
import NewsTile from "./NewsTile";
import { useLoaderData } from "react-router-dom";
import {INewGridItem} from "./NewsItem";

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
  const observerRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!observerRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadNews(page);
        }
      },
      {
        rootMargin: "100px"
      }
    );
    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [news, hasMore, loading]);

  const memoizedNewsTiles = useMemo(() => {
    return news.map((item, idx) => (
      <NewsTile
        key={item.id}
        expandedId={expandedId}
        newsItem={item}
        setExpandedId={setExpandedId}
        mockNewsItem={news[expandedId! - 2]}
        actualId={idx + 1}
      />
    ));
  }, [news, expandedId]);

  return (
    <div className="page-newsGrid">
      <div className="page-newsGrid-logo">
        <img src={Logo} className="logo-news" alt="logo" />
        <h1>inFocus</h1>
      </div>
      <div className="page-newsGrid-list-news">{memoizedNewsTiles}</div>
      {hasMore && <div ref={observerRef} style={{ height: "1px" }} />}
    </div>
  );
}

export default NewsGrid;
