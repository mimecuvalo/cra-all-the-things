import { configure } from '@storybook/react';

function loadStories() {
  require('../src/styleguide');
}

configure(loadStories, module);
