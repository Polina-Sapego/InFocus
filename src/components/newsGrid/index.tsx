import React, {useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";
import Logo from "@images/logoNews.png";
import NewsTile from "./NewsTile";

const PAGE_SIZE = 4;

let hasInitialLoaded = false;

function NewsGrid() {
  const [news, setNews] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadNews = async () => {
    try {
      const res = await axios.get("http://localhost:3000/news", {
        params: { page, limit: PAGE_SIZE }
      });
      setNews(prev => [...prev, ...res.data.news]);
      setHasMore(res.data.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Ошибка загрузки новостей", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasInitialLoaded) {
      loadNews();
      hasInitialLoaded = true;
    }
  }, []);

  useEffect(() => {
    if (!observerRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadNews();
        }
      },
    {
      rootMargin: "100px"
    }
    )
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
