import React from 'react';
import { Tag } from './Tag.jsx';

export default {
  title: 'Components/Tag',
  component: Tag,
  args: {
    children: 'Tag',
    theme: 'pink',
    type: 'primary',
    shape: 'default',
    showLeftIcon: true,
    showRightIcon: true,
    disabled: false,
    loading: false,
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['pink', 'cyan', 'indigo', 'lime', 'orange', 'purple', 'tomato', 'neutral'],
    },
    type: {
      control: 'radio',
      options: ['primary', 'outline', 'dashed', 'link'],
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
  args: {},
};

export const VisualSystem = {
  render: () => (
    <div className="story-stack">
      <div className="story-row">
        <Tag theme="pink">Pink</Tag>
        <Tag theme="cyan">Cyan</Tag>
        <Tag theme="indigo">Indigo</Tag>
        <Tag theme="lime">Lime</Tag>
        <Tag theme="orange">Orange</Tag>
        <Tag theme="purple">Purple</Tag>
        <Tag theme="tomato">Tomato</Tag>
        <Tag theme="neutral">Neutral</Tag>
      </div>
      <div className="story-row">
        <Tag type="primary">Primary</Tag>
        <Tag type="outline">Outline</Tag>
        <Tag type="dashed">Dashed</Tag>
        <Tag type="link">Link</Tag>
      </div>
      <div className="story-row">
        <Tag>Interactive</Tag>
        <Tag state="hover">Hover</Tag>
        <Tag state="active">Active</Tag>
        <Tag loading>Loading</Tag>
        <Tag disabled>Disabled</Tag>
      </div>
      <div className="story-row">
        <Tag shape="round">Round</Tag>
        <Tag showRightIcon={false}>Single icon</Tag>
        <Tag showLeftIcon={false}>Suffix only</Tag>
        <Tag leftIcon="★" rightIcon="→">Custom icons</Tag>
      </div>
    </div>
  ),
};
