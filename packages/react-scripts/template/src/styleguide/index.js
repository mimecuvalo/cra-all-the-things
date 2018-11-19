import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

storiesOf('Custom', module)
  .add('Colors', () => <div>Add your color palette here</div>)
  .add('Components', () => <div>Add your custom components here</div>);

storiesOf('Material UI', module)
  .add('Demos', () => (
    <a href="https://material-ui.com/demos/app-bar/" target="_blank" rel="noopener noreferrer">
      Material UI demos
    </a>
  ))
  .add('API', () => (
    <a href="https://material-ui.com/api/app-bar/" target="_blank" rel="noopener noreferrer">
      Material UI API
    </a>
  ))
  .add('Style', () => (
    <a href="https://material-ui.com/style/icons/" target="_blank" rel="noopener noreferrer">
      Material UI style
    </a>
  ))
  .add('Layout', () => (
    <a href="https://material-ui.com/layout/basics/" target="_blank" rel="noopener noreferrer">
      Material UI layout
    </a>
  ))
  .add('Utils', () => (
    <a href="https://material-ui.com/utils/modal/" target="_blank" rel="noopener noreferrer">
      Material UI utils
    </a>
  ));
