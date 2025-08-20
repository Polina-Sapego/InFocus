import { useEffect, useState, useCallback } from "react";
import { likeHistory } from "../../services/likeHistory";

export function useUserLikes(id: number) {
  const [isLiked, setIsLiked] = useState<boolean>(() => likeHistory.getLikes().includes(id));

  useEffect(() => {
    return likeHistory.subscribe(() => {
      setIsLiked(likeHistory.getLikes().includes(id));
    });
  }, [id]);

  const toggleLike = useCallback(() => {
    if (likeHistory.getLikes().includes(id)) {
      likeHistory.unlike(id);
    } else {
      likeHistory.like(id);
    }
    setIsLiked(likeHistory.getLikes().includes(id));
  }, [id]);

  return { isLiked, toggleLike };
}
