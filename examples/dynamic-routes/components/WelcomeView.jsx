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