import React from 'react';
import { ArticleView } from './ArticleView'; 

const InfoView = ({ translate }) => {
  const translations = [
    'info.article.title',
    'info.article.description',
    'info.article.plot',
    'info.article.review'
  ];
  return (
    <div>
      <h1>{ translate('info.title') }</h1>
      <p>{ translate('info.body') }</p>

      <ArticleView translations={ translate(translations) } />

      <button>{ translate('info.click-here') }</button>
    </div>
  );
}

export default InfoView;