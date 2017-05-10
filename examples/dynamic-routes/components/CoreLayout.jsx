import React from 'react';
import { Link } from 'react-router';
import { localize } from 'react-localize-redux';

const CoreLayout = ({ children, currentLanguage, translate }) =>
  <div>
    <nav>
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
  </div>;

const CoreLayoutLocalized = localize()(CoreLayout);

export default CoreLayoutLocalized;
