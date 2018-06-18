// @flow
import React from 'react';
import { withLocalize, Translate } from 'react-localize-redux';
import translations from '../translations/books.json';
import largeTranslations from '../translations/seed-translations.json';
import '../Main.css';
import FormatCurrency from '../FormatCurrency';

class Books extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      books: ['book1', 'book2', 'book3']
    };

    this.props.addTranslation(translations);
    this.props.addTranslation(largeTranslations);
  }

  addBook() {
    const index = Math.floor(Math.random() * 3) + 1;
    this.setState({
      books: [...this.state.books, `book${index}`]
    });
  }

  render() {
    return (
      <div className="content">
        In this section the following features are demostrated:
        <ul>
          <li>Translate component's render props API</li>
          <li>Nested translation data format</li>
          <li>
            Overriding default language translation data with Translate's
            children
          </li>
          <li>Using translation data with placeholders</li>
          <li>Adding localize props using withLocalize HOC</li>
        </ul>
        <h2>
          <Translate
            id="books.heading"
            data={{ count: this.state.books.length }}
          >
            {'Top ${count} books:'}
          </Translate>
        </h2>
        <p>
          Money: <FormatCurrency>1000.00</FormatCurrency>
        </p>
        <Translate>
          {({ translate }) =>
            this.state.books.map((book, index) => (
              <div key={index}>
                <h2>{translate(`books.list.${book}.title`)}</h2>
                <p>{translate(`books.list.${book}.description`)}</p>
              </div>
            ))
          }
        </Translate>
        <button onClick={() => this.addBook()}>Add Book</button>
      </div>
    );
  }
}

export default withLocalize(Books);
