import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "@images/logoNews.jpg";
import NewsTile from "@components/newsGrid/NewsTile";

const PAGE_SIZE = 4;

let hasInitialLoaded = false;

function NewsGrid() {
  const [news, setNews] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadNews = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

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

  return (
    <div className="page-newsGrid">
      <div className="page-newsGrid-logo">
        <img src={Logo} className="logo-news" alt="logo" />
        <h1>inFocus</h1>
      </div>
      <div className="page-newsGrid-list-news">
        {news.map((item, idx) => (
          <NewsTile
            key={item.id}
            expandedId={expandedId}
            newsItem={item}
            setExpandedId={setExpandedId}
            mockNewsItem={news[expandedId! - 2]}
            actualId={idx + 1}
          />
        ))}
      </div>
      {hasMore && (
        <button className="button-news" onClick={loadNews} disabled={loading}>
          {loading ? "Загрузка..." : "Загрузить ещё"}
        </button>
      )}
    </div>
  );
}

export default NewsGrid;
