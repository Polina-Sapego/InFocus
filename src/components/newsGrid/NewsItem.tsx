import React from "react";
import NewGrid, {INewGridItem} from "@components/newsGrid/NewGrid";


interface NewsItemProps {
  expandedId: number | null;
  actualId: number;
  newsItem: INewGridItem;
  setExpandedId: (id: number | null) => void;
  mockNewsItem: INewGridItem;
}

const NewsItem: React.FC<NewsItemProps> = ({
expandedId,
actualId,
newsItem,
setExpandedId,
mockNewsItem
}) => {

  const handleTogglePrevious = () => {
    if (expandedId !== null) {
      setExpandedId(expandedId === expandedId - 1 ? null : expandedId - 1);
    }
  }
  const handleToggleCurrent = () => (setExpandedId(actualId === expandedId ? null : actualId))

  return (
    <React.Fragment key={actualId}>
      <div
        className={`page-newsGrid-news-card ${expandedId === actualId ? 'expanded' : ''}`}
        onClick={handleToggleCurrent}
      >
        <NewGrid
          item={newsItem}
          isExpanded={expandedId === actualId}
          onClick={handleToggleCurrent}
        />
      </div>
      {expandedId !== null &&
        expandedId % 3 === 0 &&
        actualId === expandedId && (
          <div
            className="page-newsGrid-news-card"
            onClick={handleTogglePrevious}
          >
            <NewGrid
              item={mockNewsItem}
              isExpanded={false}
              onClick={handleTogglePrevious}
            />
          </div>
        )}
    </React.Fragment>
  );
}

export default NewsItem;
