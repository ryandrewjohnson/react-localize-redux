// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { localize, getTranslate, getActiveLanguage, Translate, setActiveLanguage } from 'react-localize-redux';
import { getLanguages } from '../../../src/locale';

const CoreLayout = ({ children, count, click, setActiveLanguage }) => {
  let items = [];

  for(let i = 0; i < 1000; i++) {
    items.push(i);
  }

  return (
    <div>
      <header>
        <Translate>
          {(translate, activeLanguage, languages) =>
            <ul>
              {languages.map(language => 
                <li key={language.code}>
                  <button onClick={() => setActiveLanguage(language.code)}>{language.name} - ({language.code})</button>
                </li>
              )} 
            </ul>
          }
        </Translate>
      </header>

      <nav>
        <button onClick={ click }>Click count: { count }</button>
      
        <Translate>
          {(translate, activeLanguage) => 
            <ul>
              <li>
                <Link to={ `${ activeLanguage.code }/welcome` }>{ translate('welcome-page') }</Link>  
              </li>
              <li>
                <Link to={ `${ activeLanguage.code }/info` }>{ translate('info-page') }</Link>
              </li>
            </ul>
          }
        </Translate>
      
      </nav>
      <main>
        { children }

        {/* {items.map((item, index) => 
          <Translate key={index} id="info-page">
            <h1>Heading</h1>
            <ul>
              <li>Item #1</li>
            </ul>
          </Translate>
        )} */}
      </main>
    </div>
  );
}

const mapDispatchToProps: any = (dispatch) => {
  return {
    setActiveLanguage: (code) => dispatch(setActiveLanguage(code)),
    click: () => dispatch({ type: 'CLICKED' })
  };
};

export default connect(null, mapDispatchToProps)(CoreLayout);