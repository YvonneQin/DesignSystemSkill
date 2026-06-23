import React from 'react';
import { WorkspaceOverview } from './WorkspaceOverview.jsx';

export default {
  title: 'Design System/Workbench',
  component: WorkspaceOverview,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  render: () => <WorkspaceOverview />,
};
