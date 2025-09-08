import React, {useEffect, useState} from "react";

export function useShowFavorites (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const key = "showFavorites";
  const [showFavorites, setShowFavorites] = useState<boolean>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : false;
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(showFavorites));
  }, [showFavorites]);

  return [showFavorites, setShowFavorites]
}
