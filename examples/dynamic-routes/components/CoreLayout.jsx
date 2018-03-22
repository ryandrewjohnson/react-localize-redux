// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { localize, getTranslate, getActiveLanguage } from 'react-localize-redux';
import { Translate } from '../../../src';

const Tester = translate => props => {
  console.log(props.children);
  // need to use default language, or let user pass language 
  // check if the string in props.children is already stored in redux
    // if yes bypass resaving it
    // if no then save to redux, if props.data is set then run through template parser
  return translate(props.id);
};

const CoreLayout = ({ children, currentLanguage, translate, count, click, Tester }) => {
  let items = [];

  for(let i = 0; i < 1000; i++) {
    items.push(i);
  }
  return (
    <div>
      <Tester id="welcome-page">Here is my copy</Tester>
      {/* <Tester /> */}
      <nav>
        <button onClick={ click }>Click count: { count }</button>
        <ul>
          <li>
            <Link to={ `${ currentLanguage }/welcome` }>{ translate('welcome-page') }</Link>
            <Link to={ `${ currentLanguage }/info` }>{ translate('info-page') }</Link>
          </li>
        </ul>
      </nav>
      <main>
        
        
        
        { children }

        {items.map((item, index) => 
          <Translate key={index} id="info-page">Hey here is the new translation</Translate>
        )}
      </main>
    </div>
  );
}
  

const mapStateToProps = state => {
  const translate = getTranslate(state.locale);

  return {
    currentLanguage: getActiveLanguage(state.locale).code,
    translate,
    count: state.clicks,
    Tester: Tester(translate)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    click: () => dispatch({ type: 'CLICKED' })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout);