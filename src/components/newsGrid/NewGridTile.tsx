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

const NewsGrid: React.FC<INewsGridProps> = ({item, isExpanded, onClick}) => {
  const {image, title, tags, description, content, date, author} = item;

  return (
    <div className={`page-newGrid ${isExpanded ? 'expanded' : ''}`} onClick={onClick}>
      <div className={`page-newsGrid-picture ${isExpanded ? 'transform-picture' : ''}`}>
        <img className="newsGrid-picture-card" src={image} alt={title}/>
        <div className="page-newsGrid-meta">
          <div className="page-newGrid-meta-description">
            <h2>{title}</h2>
            <span>#{tags[0]} | {date} | {author}</span>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="page-newsGrid-content-wrapper">
          <div className={`page-newsGrid-content ${isExpanded ? 'visible' : ''}`}>
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

export default NewsGrid;
