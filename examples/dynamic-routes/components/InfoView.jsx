import React from 'react';
import { Translate } from 'react-localize-redux';

const InfoView = () => {
  console.log('hey');
  return (
    <div>
      <h1><Translate id="info.title">Hello from Info Page!</Translate></h1>
      {/* <p>{ translate('info.body') }</p> */}
      {/* <button>{ translate('info.click-here') }</button> */}
    </div>
  );
}

export default InfoView;