import {INewGridItem} from "./NewsItem";
import {useUserLikes} from "./useUserLikes";
import React from "react";

export function withLikeDecorator<T extends object>(
  WrappedComponent: React.ComponentType<
    T & { isLiked: boolean; onLikeClick: (e: React.MouseEvent) => void }
  >
) {
  return function LikeDecorator(props: T & { newsItem: INewGridItem }) {
    const { id } = props.newsItem;
    const { isLiked, toggleLike } = useUserLikes(id);

    const handleLikeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleLike();
    };

    return (
      <WrappedComponent
        {...props}
        isLiked={isLiked}
        onLikeClick={handleLikeClick}
      />
    );
  };
}
