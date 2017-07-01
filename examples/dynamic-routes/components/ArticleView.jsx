import React from 'react';

export const ArticleView = ({ translations }) => {
  return (
    <article>
      <header>
        <h2>{ translations['info.article.title'] }</h2>
      </header>
      
      <p>{ translations['info.article.plot'] }</p>

      <section>
        <p>{ translations['info.article.review'] }</p>
      </section>
    </article>
  );
};
