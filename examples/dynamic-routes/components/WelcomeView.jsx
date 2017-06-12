import React from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

const WelcomeView = ({ translate }) => {
  return (
    <div>
      <h1>{ translate('title', { name: 'Ryan Johsnon' }) }</h1>
      <p>{ translate('body') }</p>
      <button>{ translate('click-here') }</button>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    translate: getTranslate(state)
  };
};

export default connect(mapStateToProps)(WelcomeView);