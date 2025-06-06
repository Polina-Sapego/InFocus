import React from "react";
import Logo from '@images/logoNews.jpg'

function NewsGrid() {
  return <div>
    <div className="picture-news"><img/></div>
    <div className="logo-news">
      <img src={Logo} className="page-forYou-image"/>
      <h1>inFocus</h1>
    </div>
    <div className="list-news"></div>
  </div>;
}

export default NewsGrid;