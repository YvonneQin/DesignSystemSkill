import React from 'react';
import { Input } from './Input.jsx';

export default {
  title: 'Components/Input',
  component: Input,
  args: {
    placeholder: 'Please enter',
    semantic: 'default',
    size: 'default',
    width: 360,
    showPrefixIcon: true,
    showPrefixText: true,
    showSuffixText: true,
    showSuffixIcon: true,
    disabled: false,
  },
  argTypes: {
    semantic: {
      control: 'radio',
      options: ['default', 'danger', 'warning', 'success'],
    },
    size: {
      control: 'radio',
      options: ['small', 'default', 'large'],
    },
    state: {
      control: 'radio',
      options: [undefined, 'default', 'hover', 'focused', 'typing', 'filled', 'disabled'],
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
    <div className="story-stack story-stack--column">
      <div className="story-grid story-grid--input">
        <Input />
        <Input state="hover" />
        <Input state="focused" />
        <Input state="typing" value="Typing value" />
        <Input state="filled" value="Filled value" />
        <Input disabled />
      </div>
      <div className="story-grid story-grid--input">
        <Input semantic="default" />
        <Input semantic="danger" suffixText="Error" suffixIcon="!" />
        <Input semantic="warning" suffixText="Warning" suffixIcon="!" />
        <Input semantic="success" suffixText="Success" suffixIcon="✓" />
      </div>
      <div className="story-grid story-grid--input">
        <Input size="small" />
        <Input size="default" />
        <Input size="large" />
      </div>
      <div className="story-grid story-grid--input">
        <Input showPrefixText={false} suffixText="Search" />
        <Input prefixText="https://" suffixText=".com" showSuffixIcon={false} />
        <Input showPrefixIcon={false} showSuffixText={false} suffixIcon="⌫" value="Clearable" />
      </div>
    </div>
  ),
};
