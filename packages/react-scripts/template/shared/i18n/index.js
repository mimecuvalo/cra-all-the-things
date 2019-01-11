import {
  defineMessages as originalDefineMessages,
  FormattedHTMLMessage,
  FormattedMessage,
  injectIntl as originalInjectIntl,
} from 'react-intl';
import React from 'react';

export function generateId(id = '', msg = '', description = '') {
  if (id) {
    return id;
  }

  const scrubbedMsg = msg.replace(/\W/g, '_');
  const scrubbedDesc = description.replace(/\W/g, '_');

  return scrubbedMsg + (scrubbedDesc ? '___' : '') + scrubbedDesc;
}

export const F = React.memo(function F({ id, description, msg, values }) {
  return (
    <FormattedMessage
      id={generateId(id, msg, description)}
      description={description}
      defaultMessage={msg}
      values={values}
    />
  );
});

export const FHTML = React.memo(function FHTML({ id, description, msg, values }) {
  return (
    <FormattedHTMLMessage
      id={generateId(id, msg, description)}
      description={description}
      defaultMessage={msg}
      values={values}
    />
  );
});

export function defineMessages(values) {
  for (const key in values) {
    if (!values[key].id) {
      values[key].id = generateId('', values[key].msg, values[key].description);
      values[key].defaultMessage = values[key].msg;
    }
  }
  return originalDefineMessages(values);
}

export const injectIntl = originalInjectIntl;
