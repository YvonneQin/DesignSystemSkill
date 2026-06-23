import React from 'react';
import { TokenExplorer } from './TokenExplorer.jsx';

export default {
  title: 'Design System/Token Explorer',
  component: TokenExplorer,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  render: () => <TokenExplorer />,
};
