import {useEffect, useRef} from "react";

export function useInfiniteScroll(loadMore: () => void, hasMore: boolean, loading: boolean) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "1000px"
      }
    );
    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loadMore, hasMore, loading]);

  return {observerRef};
}
