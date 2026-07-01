import React from 'react';
import { Button } from './Button.jsx';

export default {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Button',
    theme: 'primary',
    type: 'default',
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
      options: ['primary', 'secondary', 'black', 'danger'],
    },
    type: {
      control: 'radio',
      options: ['default', 'outline', 'ghost'],
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
      options: [undefined, 'default', 'hover', 'focus', 'active', 'disabled'],
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
        <Button type="default">Primary</Button>
        <Button theme="secondary" type="default">Secondary</Button>
        <Button theme="black" type="default">Black</Button>
        <Button theme="danger" type="default">Danger</Button>
        <Button type="outline">Outline</Button>
        <Button type="ghost">Ghost</Button>
      </div>
      <div className="story-row">
        <Button type="default">Interactive</Button>
        <Button type="default" state="hover">Hover</Button>
        <Button type="default" state="focus">Focus</Button>
        <Button type="default" state="active">Pressed</Button>
        <Button type="default" disabled>Disabled</Button>
      </div>
      <div className="story-row">
        <Button type="default" size="small">Small</Button>
        <Button type="default">Default</Button>
        <Button type="default" size="large">Large</Button>
        <Button type="outline" theme="black">Black outline</Button>
        <Button type="ghost" theme="danger">Ghost danger</Button>
        <Button type="default" loading>Loading fallback</Button>
      </div>
      <div className="story-row">
        <Button type="default" iconLeft="←">Button</Button>
        <Button type="outline" iconRight="→">Continue</Button>
        <Button type="default" iconLeft="★" iconOnly />
        <Button type="outline" shape="round">Round</Button>
      </div>
    </div>
  ),
};
