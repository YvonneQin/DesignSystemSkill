import React from 'react';
import { Button } from './Button.jsx';

export default {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
    theme: 'primary',
    type: 'primary',
    size: 'default',
    shape: 'default',
    disabled: false,
    loading: false,
    iconLeft: null,
    iconRight: null,
    iconOnly: false,
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['primary', 'secondary', 'danger'],
    },
    type: {
      control: 'radio',
      options: ['primary', 'outline', 'dashed', 'text', 'ghost'],
    },
    size: {
      control: 'radio',
      options: ['small', 'default', 'large'],
    },
    shape: {
      control: 'radio',
      options: ['default', 'round'],
    },
    state: {
      control: 'radio',
      options: [undefined, 'default', 'hover', 'active', 'loading', 'disabled'],
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export const Playground = {
  args: {
    children: 'Button',
  },
};

export const VisualSystem = {
  render: () => (
    <div className="story-stack">
      <div className="story-row">
        <Button type="primary">Primary</Button>
        <Button theme="secondary" type="primary">Secondary</Button>
        <Button type="outline">Outline</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="text">Text</Button>
        <Button type="ghost">Ghost</Button>
      </div>
      <div className="story-row">
        <Button type="primary">Interactive</Button>
        <Button type="primary" state="hover">Hover</Button>
        <Button type="primary" state="active">Pressed</Button>
        <Button type="primary" loading>Loading</Button>
        <Button type="primary" disabled>Disabled</Button>
      </div>
      <div className="story-row">
        <Button type="primary" size="small">Small</Button>
        <Button type="primary">Default</Button>
        <Button type="primary" size="large">Large</Button>
        <Button type="outline" theme="secondary">Secondary outline</Button>
        <Button type="primary" theme="danger">Danger</Button>
        <Button type="ghost" theme="secondary">Ghost secondary</Button>
      </div>
      <div className="story-row">
        <Button type="primary" iconLeft="←">Button</Button>
        <Button type="outline" iconRight="→">Continue</Button>
        <Button type="primary" iconLeft="★" iconOnly />
        <Button type="outline" shape="round">Round</Button>
      </div>
    </div>
  ),
};
