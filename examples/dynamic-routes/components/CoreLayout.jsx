// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { localize, getTranslate, getActiveLanguage } from 'react-localize-redux';

const CoreLayout = ({ children, currentLanguage, translate, count, click }) => {
  return (
    <div>
      <nav>
        {/* <button onClick={ click }>Click count: { count }</button> */}
        <ul>
          <li>
            <Link to={ `${ currentLanguage }/welcome` }>{ translate('welcome-page') }</Link>
            <Link to={ `${ currentLanguage }/info` }>{ translate('info-page') }</Link>
          </li>
        </ul>
      </nav>
      <main>
        { children }
      </main>
    </div>
  );
}
  

const mapStateToProps = state => {
  return {
    currentLanguage: getActiveLanguage(state.locale).code,
    translate: getTranslate(state.locale),
    count: state.clicks
  }
}

export default connect(mapStateToProps)(CoreLayout);