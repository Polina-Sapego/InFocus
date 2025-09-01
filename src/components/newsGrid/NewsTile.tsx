import React, { useRef } from "react";
import NewsItem, {INewGridItem} from "./NewsItem";
import { addStat } from "../../services/statsCollector";

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

  const hoverStart = useRef<number | null>(null);

  const handleToggleCurrent = () => (setExpandedId(actualId === expandedId ? null : actualId))

  const handleMouseEnter = () => {
    hoverStart.current = Date.now();
  }

  const handleMouseLeave = () => {
    if (hoverStart.current) {
      const timeSpent = (Date.now() - hoverStart.current) / 1000;
      addStat(newsItem.id.toString(), timeSpent);
      hoverStart.current = null;
    }
  }

  return (
    <React.Fragment key={actualId}>
      <div
        className={`page-newsItem-news-card ${expandedId === actualId ? 'expanded' : ''}`}
        onClick={handleToggleCurrent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
