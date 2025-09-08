import React from "react";
import NewsItem, {INewGridItem} from "./NewsItem";
import { addStat } from "../../services/statsCollector";
import {useHoverTime} from "../../hooks/useHoverTime";

interface NewsItemProps {
  expandedId: number | null;
  actualId: number;
  newsItem: INewGridItem;
  setExpandedId: (id: number | null) => void;
  mockNewsItem: INewGridItem;
  isLiked?: boolean;
  onLikeClick?: (e: React.MouseEvent) => void;
}

const NewsTile: React.FC<NewsItemProps> = ({
expandedId,
actualId,
newsItem,
setExpandedId,
isLiked,
onLikeClick
}) => {

  const handleToggleCurrent = () => (setExpandedId(actualId === expandedId ? null : actualId))

  const { onMouseEnter, onMouseLeave } = useHoverTime((timeSpent) => {
    addStat(newsItem.id.toString(), timeSpent);
  });

  return (
    <React.Fragment key={actualId}>
      <div
        className={`page-newsItem-news-card ${expandedId === actualId ? 'expanded' : ''}`}
        onClick={handleToggleCurrent}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <NewsItem
          item={newsItem}
          isExpanded={expandedId === actualId}
          onClick={handleToggleCurrent}
          isLiked={isLiked}
          onLikeClick={onLikeClick}
        />
      </div>
    </React.Fragment>
  );
}

export default NewsTile;
