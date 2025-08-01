import React from "react";
import NewsItem, {INewGridItem} from "./NewsItem";

interface NewsItemProps {
  expandedId: number | null;
  actualId: number;
  newsItem: INewGridItem;
  setExpandedId: (id: number | null) => void;
  mockNewsItem: INewGridItem;
  shouldHideBeforeExpanded: boolean;
}

const NewsTile: React.FC<NewsItemProps> = ({
expandedId,
actualId,
newsItem,
setExpandedId
}) => {

  const handleToggleCurrent = () => (setExpandedId(actualId === expandedId ? null : actualId))

  return (
    <React.Fragment key={actualId}>
      <div
        className={`page-newsItem-news-card ${expandedId === actualId ? 'expanded' : ''}`}
        onClick={handleToggleCurrent}
      >
        <NewsItem
          item={newsItem}
          isExpanded={expandedId === actualId}
          onClick={handleToggleCurrent}
        />
      </div>
    </React.Fragment>
  );
}

export default NewsTile;
