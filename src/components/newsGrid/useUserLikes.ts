import { useState, useEffect } from "react";
import { getCurrentUser, getUserLikes, setUserLikes } from "../userStorage";

export function useUserLikes(itemId: number) {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    setIsLiked(getUserLikes(currentUser).includes(itemId));
  }, [itemId]);

  const toggleLike = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const likes = getUserLikes(currentUser);
    const updatedLikes = isLiked
      ? likes.filter(id => id !== itemId)
      : [...likes, itemId];

    setUserLikes(currentUser, updatedLikes);
    setIsLiked(!isLiked);
  };

  return { isLiked, toggleLike };
}
