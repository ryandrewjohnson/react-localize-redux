import React from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

const Tester = props => {
  console.log(props);
  return (
    <div>
      { props['welcome.body'] }
      { props['welcome.click-here'] }
    </div>
  );
}

const WelcomeView = ({ translate }) => {
  return (
    <div>
      <Tester 
        { ...translate(['welcome.body', 'welcome.click-here']) }
      />
      <h1>{ translate('welcome.title', { name: 'Ryan Johsnon' }) }</h1>
      <p>{ translate('welcome.body') }</p>
      <button>{ translate('welcome.click-here') }</button>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    translate: getTranslate(state.locale)
  };
};

export default connect(mapStateToProps)(WelcomeView);