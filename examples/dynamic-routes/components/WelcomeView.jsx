// @flow
import React from 'react';
import { getTranslate, addTranslation } from 'react-localize-redux';
import { connect } from 'react-redux';

const WelcomeView = ({ translate, addTranslation, count }) => {
  return (
    <div>
      <p>Render Count: { count }</p>
      <h1>{ translate('welcome.title', { name: 'Ryan Johsnon' }) }</h1>
      <p>{ translate('welcome.body') }</p>
      <button onClick={ () => addTranslation({ newstuff: ['newstuff EN', 'newstuff FR', 'newstuff ES']}) }>{ translate('welcome.click-here') }</button>

      <article>
        <h2>{ translate('title') }</h2>
        <p>{ translate('description') }</p>
        <p>{ translate('author') }</p>
        <code>{ translate('html', null, { renderInnerHtml: false })}</code>
      </article>
     
    </div>  
  );
}

const mapStateToProps = state => {
  return {
    translate: getTranslate(state.locale)
  };
};

const mapDispatchToProps = {
  addTranslation
};

export default connect(mapStateToProps, mapDispatchToProps, null, { renderCountProp: 'count' })(WelcomeView);