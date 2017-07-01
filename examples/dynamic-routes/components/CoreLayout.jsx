import React from 'react';
import { Link } from 'react-router';
import { localize } from 'react-localize-redux';

const activeButtonStyle = {
  color: '#fff',
  backgroundColor: '#337ab7'
};

const CoreLayout = ({ children, currentLanguage, translate }) =>
  <div className="container-fluid">
    <div className="header clearfix">
      <nav>
        <ul className="nav nav-pills pull-right">
          
          {/*<li role="presentation" class="active"><a href="#">Home</a></li>*/}
          {/*<li role="presentation"><a href="#">About</a></li>*/}
          {/*<li role="presentation"><a href="#">Contact</a></li>*/}
        </ul>
      </nav>
      <h3 className="text-muted">Movie Reviews</h3>
    </div>

    <div className="jumbotron">
      <h1>Welcome to useless movie reviews!</h1>
      <p className="lead">Ever wanted to learn about your fav movies? Well you're in the wrong place.</p>
      {/*<p><a className="btn btn-lg btn-success" href="#" role="button">Sign up today</a></p>*/}
    </div>

    <main className="row marketing">
      <div className="col-sm-4">
        <ul className="nav nav-pills nav-stacked">
          <li>
            <Link activeStyle={ activeButtonStyle } to={ `${ currentLanguage }/welcome` }>{ translate('welcome-page') }</Link>
          </li>
          <li>
            <Link activeStyle={ activeButtonStyle } to={ `${ currentLanguage }/info` }>{ translate('info-page') }</Link>
          </li>
        </ul>
      </div>

      <div className="col-sm-8">
        { children }
      </div>
    </main>
    
    <footer className="footer">
      <p>© 2017 Company, Inc.</p>
    </footer>
  </div>;

export default localize(CoreLayout, 'locale');
