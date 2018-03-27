// @flow
import React from 'react';
import { addTranslation, Translate } from 'react-localize-redux';
import { connect } from 'react-redux';

const WelcomeView = ({ addTranslation, count }) => {
  return (
    <div>
      <p>Render Count: { count }</p>
      <h1>
        <Translate id="welcome.title" data={{name: 'Ted Teddy'}}>
          {'Hello ${ name } from Welcome Page!'}
        </Translate>
      </h1>
      <p>
        <Translate id="welcome.body" />
      </p>
      <button onClick={ () => addTranslation({ newstuff: ['newstuff EN', 'newstuff FR', 'newstuff ES']}) }>
        <Translate id="welcome.click-here" />
      </button>

      
      <Translate>
        {translate => 
          <article>
            <h2>{ translate('title') }</h2>
            <p>{ translate('description') }</p>
            <p>{ translate('author') }</p>
            <code>{ translate('html', null, { renderInnerHtml: false })}</code>
          </article>
        }
      </Translate>
    </div>  
  );
}

const mapDispatchToProps = {
  addTranslation
};

export default connect(null, mapDispatchToProps, null, { renderCountProp: 'count' })(WelcomeView);