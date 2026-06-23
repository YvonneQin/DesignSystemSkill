import{j as e}from"./jsx-runtime-D_zvdyIk.js";import"./index-Y0gaZlcC.js";import{Tag as a}from"./Tag-Cp8K2FXj.js";import"./tag-CbV0JaFR.js";import"./ds-theme-CRTj5Gkf.js";import"./en-text-styles-kC2ZsXAR.js";const u={title:"Components/Tag",component:a,args:{children:"Tag",theme:"pink",type:"primary",shape:"default",showLeftIcon:!0,showRightIcon:!0,disabled:!1,loading:!1},argTypes:{theme:{control:"radio",options:["pink","cyan","indigo","lime","orange","purple","tomato","neutral"]},type:{control:"radio",options:["primary","outline","dashed","link"]},shape:{control:"radio",options:["default","round"]},state:{control:"radio",options:[void 0,"default","hover","active","loading","disabled"]}},parameters:{layout:"centered"}},n={args:{}},r={render:()=>e.jsxs("div",{className:"story-stack",children:[e.jsxs("div",{className:"story-row",children:[e.jsx(a,{theme:"pink",children:"Pink"}),e.jsx(a,{theme:"cyan",children:"Cyan"}),e.jsx(a,{theme:"indigo",children:"Indigo"}),e.jsx(a,{theme:"lime",children:"Lime"}),e.jsx(a,{theme:"orange",children:"Orange"}),e.jsx(a,{theme:"purple",children:"Purple"}),e.jsx(a,{theme:"tomato",children:"Tomato"}),e.jsx(a,{theme:"neutral",children:"Neutral"})]}),e.jsxs("div",{className:"story-row",children:[e.jsx(a,{type:"primary",children:"Primary"}),e.jsx(a,{type:"outline",children:"Outline"}),e.jsx(a,{type:"dashed",children:"Dashed"}),e.jsx(a,{type:"link",children:"Link"})]}),e.jsxs("div",{className:"story-row",children:[e.jsx(a,{children:"Interactive"}),e.jsx(a,{state:"hover",children:"Hover"}),e.jsx(a,{state:"active",children:"Active"}),e.jsx(a,{loading:!0,children:"Loading"}),e.jsx(a,{disabled:!0,children:"Disabled"})]}),e.jsxs("div",{className:"story-row",children:[e.jsx(a,{shape:"round",children:"Round"}),e.jsx(a,{showRightIcon:!1,children:"Single icon"}),e.jsx(a,{showLeftIcon:!1,children:"Suffix only"}),e.jsx(a,{leftIcon:"★",rightIcon:"→",children:"Custom icons"})]})]})};var s,o,t;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {}
}`,...(t=(o=n.parameters)==null?void 0:o.docs)==null?void 0:t.source}}};var i,d,l;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <div className="story-stack">
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
}`,...(l=(d=r.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};const y=["Playground","VisualSystem"];export{n as Playground,r as VisualSystem,y as __namedExportsOrder,u as default};
