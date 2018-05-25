// @flow
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Route, NavLink } from 'react-router-dom';
import ToggleButton from 'react-toggle-button'
import { withLocalize, Translate } from 'react-localize-redux';
import LanguageToggle from './LanguageToggle';
import globalTranslations from './translations/global.json';
import Movies from './sections/Movies';
import Books from './sections/Books';
import * as classes from './Main.css';

class Main extends React.Component<any, any> {

  constructor(props) {
    super(props);

    this.props.initialize({
      languages: [
        { name: 'English', code: 'en' }, 
        { name: 'French', code: 'fr' }, 
        { name: 'Spanish', code: 'es' }
      ],
      translation: globalTranslations,
      options: { renderToStaticMarkup }
    });
  }

  componentDidUpdate(prevProps) {
    const prevLangCode = prevProps.activeLanguage && prevProps.activeLanguage.code;
    const curLangCode = this.props.activeLanguage && this.props.activeLanguage.code;
    const hasLanguageChanged = prevLangCode !== curLangCode;
    console.log('test', hasLanguageChanged);
  }

  render() {
    return (
      <div>
        <header>
          <LanguageToggle />

          Using Redux
          <ToggleButton
            value={this.props.toggleValue}
            thumbStyle={{borderRadius: 2}}
            trackStyle={{borderRadius: 2}}
            onToggle={() => this.props.onToggleClick()} 
            />
        </header>
        
        <main>
          <nav>
            <NavLink to="/movies" activeClassName="active">Movies</NavLink>
            <NavLink to="/books" activeClassName="active">Books</NavLink>
          </nav>
          
          <Route exact path="/movies" component={Movies} />
          <Route exact path="/books" component={Books} />
        </main>

        {/* <h1>
          <Translate id="title">Title</Translate>
        </h1> */}
      </div>
    );
  }
}

export default withLocalize(Main);