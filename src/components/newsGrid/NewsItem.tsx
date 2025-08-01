import React from "react";

export interface INewGridItem {
  image: string;
  title: string;
  tags: string[];
  description: string;
  content: string;
  date: string;
  author: string;
}

interface INewsGridProps {
  item: INewGridItem;
  isExpanded: boolean;
  onClick: () => void;
}

const NewsItem: React.FC<INewsGridProps> = ({item, isExpanded, onClick}) => {
  const {image, title, tags, description, content, date, author} = item;

  return (
    <div className={`page-newsItem ${isExpanded ? 'expanded' : ''}`} onClick={onClick}>
      <div className={`page-newsItem-picture ${isExpanded ? 'transform-picture' : ''}`}>
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
