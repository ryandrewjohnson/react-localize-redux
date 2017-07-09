import React from 'react';

const InfoView = ({ translate }) => {
  return (
    <div>
      <h1>{ translate('info.title') }</h1>
      <p>{ translate('info.body') }</p>
      <button>{ translate('info.click-here') }</button>
    </div>
  );
}

export default InfoView;