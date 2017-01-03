import React from 'react';
import { Link } from 'react-router';
import { localize } from 'react-localize-redux';

const CoreLayout = ({ children, currentLanugage, translate }) =>
  <div>
    <nav>
      <ul>
        <li>
          <Link to={ `${ currentLanugage }/welcome` }>{ translate('welcome-page') }</Link>
          <Link to={ `${ currentLanugage }/info` }>{ translate('info-page') }</Link>
        </li>
      </ul>
    </nav>
    <main>
      { children }
    </main>
  </div>;

const CoreLayoutLocalized = localize()(CoreLayout);

export default CoreLayoutLocalized;
