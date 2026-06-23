import{j as s}from"./jsx-runtime-D_zvdyIk.js";import"./index-Y0gaZlcC.js";import{Input as e}from"./Input-Cd3u59Eb.js";import"./input-CVLclJGW.js";import"./ds-theme-CRTj5Gkf.js";import"./en-text-styles-kC2ZsXAR.js";const g={title:"Components/Input",component:e,args:{placeholder:"Please enter",semantic:"default",size:"default",width:360,showPrefixIcon:!0,showPrefixText:!0,showSuffixText:!0,showSuffixIcon:!0,disabled:!1},argTypes:{semantic:{control:"radio",options:["default","danger","warning","success"]},size:{control:"radio",options:["small","default","large"]},state:{control:"radio",options:[void 0,"default","hover","focused","typing","filled","disabled"]}},parameters:{layout:"centered"}},t={args:{}},r={render:()=>s.jsxs("div",{className:"story-stack story-stack--column",children:[s.jsxs("div",{className:"story-grid story-grid--input",children:[s.jsx(e,{}),s.jsx(e,{state:"hover"}),s.jsx(e,{state:"focused"}),s.jsx(e,{state:"typing",value:"Typing value"}),s.jsx(e,{state:"filled",value:"Filled value"}),s.jsx(e,{disabled:!0})]}),s.jsxs("div",{className:"story-grid story-grid--input",children:[s.jsx(e,{semantic:"default"}),s.jsx(e,{semantic:"danger",suffixText:"Error",suffixIcon:"!"}),s.jsx(e,{semantic:"warning",suffixText:"Warning",suffixIcon:"!"}),s.jsx(e,{semantic:"success",suffixText:"Success",suffixIcon:"✓"})]}),s.jsxs("div",{className:"story-grid story-grid--input",children:[s.jsx(e,{size:"small"}),s.jsx(e,{size:"default"}),s.jsx(e,{size:"large"})]}),s.jsxs("div",{className:"story-grid story-grid--input",children:[s.jsx(e,{showPrefixText:!1,suffixText:"Search"}),s.jsx(e,{prefixText:"https://",suffixText:".com",showSuffixIcon:!1}),s.jsx(e,{showPrefixIcon:!1,showSuffixText:!1,suffixIcon:"⌫",value:"Clearable"})]})]})};var i,a,n;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {}
}`,...(n=(a=t.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};var o,u,l;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => <div className="story-stack story-stack--column">
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
}`,...(l=(u=r.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};const I=["Playground","VisualSystem"];export{t as Playground,r as VisualSystem,I as __namedExportsOrder,g as default};
