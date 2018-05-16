// @flow
import React from 'react';
import { withLocalize, Translate } from 'react-localize-redux';
import '../Main.css';

class Movies extends React.Component<any, any> {
  
  constructor(props) {
    super(props);    
    
    this.state = {
      name: ''
    };

    this.addTranslationsForActiveLanguage();
  }

  componentDidUpdate(prevProps, prevState) {
    const hasActiveLanguageChanged = prevProps.activeLanguage !== this.props.activeLanguage;

    if (hasActiveLanguageChanged) {
      this.addTranslationsForActiveLanguage();
    }
  }

  addTranslationsForActiveLanguage() {
    const {activeLanguage} = this.props;

    if (!activeLanguage) {
      return;
    }
    
    import(`../translations/${activeLanguage.code}.movies.json`) 
      .then(translations => {
        this.props.addTranslationForLanguage(translations, activeLanguage.code)
      });
  }

  render() {
    return (
      <div className="content">
        In this section the following features are demostrated:
        <ul>
          <li>Splitting translation data by language</li> 
          <li>Dynamically load translation data based on active language</li> 
          <li>Using Translate component with and without children</li>
          <li>Using translation data with placeholders</li>
          <li>Adding localize props using withLocalize HOC</li>
        </ul>

        <div>
          <label>Enter Name:</label>
          <input 
            type="text" 
            value={this.state.name} 
            onChange={(e) => this.setState({ name: e.target.value })} 
          />
        </div>

        <Translate tester="sdfsdfsf" />
    

        <h2><Translate id="greeting" data={{ name: this.state.name }}>{'Welcome ${name}!'}</Translate></h2>

        {[1, 2].map(item =>
          <div key={item}>
            <h3><Translate id={`movie${item}.title`} /></h3>
            <p><Translate id={`movie${item}.description`} /></p>
          </div>
        )}
      </div>
    )
  } 
}

export default withLocalize(Movies);