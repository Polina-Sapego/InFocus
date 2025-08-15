import React from "react";
import ActiveLike from "@images/activeLike.png";
import InactiveLike from "@images/inactiveLike.png";

export interface INewGridItem {
  id: number;
  image: string;
  title: string;
  tags: string[];
  description: string;
  content: string;
  date: string;
  author: string;
}

interface INewsItemProps {
  item: INewGridItem;
  isExpanded: boolean;
  onClick: () => void;
  isLiked?: boolean;
  onLikeClick?: (e: React.MouseEvent) => void;
}

const NewsItem: React.FC<INewsItemProps> = ({
item,
isExpanded,
onClick,
isLiked,
onLikeClick
}) => {
  const { image, title, tags, description, content, date, author } = item;

  return (
    <div
      className={`page-newsItem ${isExpanded ? "expanded" : ""}`}
      onClick={onClick}
    >
      <div
        className={`page-newsItem-picture ${
          isExpanded ? "transform-picture" : ""
        }`}
      >
        {onLikeClick && (
          <img
            className="page-newsItem-like"
            src={isLiked ? ActiveLike : InactiveLike}
            onClick={onLikeClick}
            alt="like button"
          />
        )}
        <img className="newsItem-picture-card" src={image} alt={title}/>
        <div className="page-newsItem-meta">
          <div className="page-newsItem-meta-description">
            <h2>{title}</h2>
            <span>#{tags[0]} | {date} | {author}</span>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="page-newsItem-content-wrapper">
          <div className={`page-newsItem-content ${isExpanded ? 'visible' : ''}`}>
            <h3>{title}</h3>
            <p>{description}</p>
            <p>{content}</p>
            <span>{date} | {author}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsItem;
