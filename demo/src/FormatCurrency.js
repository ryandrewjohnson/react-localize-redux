import React from 'react';
import { withLocalize } from 'react-localize-redux';

const FormatNumber = props => {
  return props.activeLanguage
    ? Number(props.children).toLocaleString(props.activeLanguage.code)
    : null;
}

export default withLocalize(FormatNumber);