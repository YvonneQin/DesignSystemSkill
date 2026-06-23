import{j as t}from"./jsx-runtime-D_zvdyIk.js";import"./index-Y0gaZlcC.js";import{Button as e}from"./Button-BMz-2UAA.js";import"./button-HUvFQ0YE.js";import"./ds-theme-CRTj5Gkf.js";import"./en-text-styles-kC2ZsXAR.js";const B={title:"Components/Button",component:e,args:{children:"Button",theme:"primary",type:"primary",size:"default",shape:"default",disabled:!1,loading:!1,iconLeft:null,iconRight:null,iconOnly:!1},argTypes:{theme:{control:"radio",options:["primary","secondary","danger"]},type:{control:"radio",options:["primary","outline","dashed","text","ghost"]},size:{control:"radio",options:["small","default","large"]},shape:{control:"radio",options:["default","round"]},state:{control:"radio",options:[void 0,"default","hover","active","loading","disabled"]}},parameters:{layout:"centered"}},r={args:{children:"Button"}},n={render:()=>t.jsxs("div",{className:"story-stack",children:[t.jsxs("div",{className:"story-row",children:[t.jsx(e,{type:"primary",children:"Primary"}),t.jsx(e,{theme:"secondary",type:"primary",children:"Secondary"}),t.jsx(e,{type:"outline",children:"Outline"}),t.jsx(e,{type:"dashed",children:"Dashed"}),t.jsx(e,{type:"text",children:"Text"}),t.jsx(e,{type:"ghost",children:"Ghost"})]}),t.jsxs("div",{className:"story-row",children:[t.jsx(e,{type:"primary",children:"Interactive"}),t.jsx(e,{type:"primary",state:"hover",children:"Hover"}),t.jsx(e,{type:"primary",state:"active",children:"Pressed"}),t.jsx(e,{type:"primary",loading:!0,children:"Loading"}),t.jsx(e,{type:"primary",disabled:!0,children:"Disabled"})]}),t.jsxs("div",{className:"story-row",children:[t.jsx(e,{type:"primary",size:"small",children:"Small"}),t.jsx(e,{type:"primary",children:"Default"}),t.jsx(e,{type:"primary",size:"large",children:"Large"}),t.jsx(e,{type:"outline",theme:"secondary",children:"Secondary outline"}),t.jsx(e,{type:"primary",theme:"danger",children:"Danger"}),t.jsx(e,{type:"ghost",theme:"secondary",children:"Ghost secondary"})]}),t.jsxs("div",{className:"story-row",children:[t.jsx(e,{type:"primary",iconLeft:"←",children:"Button"}),t.jsx(e,{type:"outline",iconRight:"→",children:"Continue"}),t.jsx(e,{type:"primary",iconLeft:"★",iconOnly:!0}),t.jsx(e,{type:"outline",shape:"round",children:"Round"})]})]})};var o,a,s;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  }
}`,...(s=(a=r.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};var i,d,y;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <div className="story-stack">
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
}`,...(y=(d=n.parameters)==null?void 0:d.docs)==null?void 0:y.source}}};const x=["Playground","VisualSystem"];export{r as Playground,n as VisualSystem,x as __namedExportsOrder,B as default};
