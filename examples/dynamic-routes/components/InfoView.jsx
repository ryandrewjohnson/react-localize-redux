import React from 'react';
import { Translate } from 'react-localize-redux';

const InfoView = () => {
  return (
    <div>
      <h1><Translate id="info.title">Hello from Info Page!</Translate></h1>
      <p>
        <Translate id="info.body">
          You can even render links in your translations <a href='http://google.com' target='_blank'>Google</a>, <a href='http://apple.com' target='_blank'>Apple</a>.
        </Translate>
      </p>
      <button>
        <Translate id="info.click-here">This local translation 'click-here' overrides the global 'click-here' key</Translate>
      </button>
    </div>
  );
}

export default InfoView;