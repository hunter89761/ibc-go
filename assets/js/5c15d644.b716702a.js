"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[1404],{65715:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>r,contentTitle:()=>l,default:()=>a,frontMatter:()=>o,metadata:()=>c,toc:()=>d});var n=i(85893),s=i(11151);const o={title:"Overview",sidebar_label:"Overview",sidebar_position:1,slug:"/ibc/light-clients/localhost/overview"},l="09-localhost",c={id:"light-clients/localhost/overview",title:"Overview",description:"Overview",source:"@site/versioned_docs/version-v8.1.x/03-light-clients/02-localhost/01-overview.md",sourceDirName:"03-light-clients/02-localhost",slug:"/ibc/light-clients/localhost/overview",permalink:"/v8/ibc/light-clients/localhost/overview",draft:!1,unlisted:!1,tags:[],version:"v8.1.x",sidebarPosition:1,frontMatter:{title:"Overview",sidebar_label:"Overview",sidebar_position:1,slug:"/ibc/light-clients/localhost/overview"},sidebar:"defaultSidebar",previous:{title:"Setup",permalink:"/v8/ibc/light-clients/setup"},next:{title:"Integration",permalink:"/v8/ibc/light-clients/localhost/integration"}},r={},d=[{value:"Overview",id:"overview",level:2},{value:"Context",id:"context",level:3},{value:"Implementation",id:"implementation",level:3},{value:"Localhost vs <em>regular</em> client",id:"localhost-vs-regular-client",level:3}];function h(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,s.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"09-localhost",children:(0,n.jsx)(t.code,{children:"09-localhost"})}),"\n",(0,n.jsx)(t.h2,{id:"overview",children:"Overview"}),"\n",(0,n.jsx)(t.admonition,{title:"Synopsis",type:"note",children:(0,n.jsx)(t.p,{children:"Learn about the 09-localhost light client module."})}),"\n",(0,n.jsx)(t.p,{children:"The 09-localhost light client module implements a localhost loopback client with the ability to send and receive IBC packets to and from the same state machine."}),"\n",(0,n.jsx)(t.h3,{id:"context",children:"Context"}),"\n",(0,n.jsx)(t.p,{children:"In a multichain environment, application developers will be used to developing cross-chain applications through IBC. From their point of view, whether or not they are interacting with multiple modules on the same chain or on different chains should not matter. The localhost client module enables a unified interface to interact with different applications on a single chain, using the familiar IBC application layer semantics."}),"\n",(0,n.jsx)(t.h3,{id:"implementation",children:"Implementation"}),"\n",(0,n.jsxs)(t.p,{children:["There exists a ",(0,n.jsxs)(t.a,{href:"/v8/ibc/light-clients/localhost/client-state",children:["single sentinel ",(0,n.jsx)(t.code,{children:"ClientState"})]})," instance with the client identifier ",(0,n.jsx)(t.code,{children:"09-localhost"}),"."]}),"\n",(0,n.jsxs)(t.p,{children:["To supplement this, a ",(0,n.jsxs)(t.a,{href:"/v8/ibc/light-clients/localhost/connection",children:["sentinel ",(0,n.jsx)(t.code,{children:"ConnectionEnd"})," is stored in core IBC"]})," state with the connection identifier ",(0,n.jsx)(t.code,{children:"connection-localhost"}),". This enables IBC applications to create channels directly on top of the sentinel connection which leverage the 09-localhost loopback functionality."]}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.a,{href:"/v8/ibc/light-clients/localhost/state-verification",children:"State verification"})," for channel state in handshakes or processing packets is reduced in complexity, the ",(0,n.jsx)(t.code,{children:"09-localhost"})," client can simply compare bytes stored under the standardized key paths."]}),"\n",(0,n.jsxs)(t.h3,{id:"localhost-vs-regular-client",children:["Localhost vs ",(0,n.jsx)(t.em,{children:"regular"})," client"]}),"\n",(0,n.jsxs)(t.p,{children:["The localhost client aims to provide a unified approach to interacting with applications on a single chain, as the IBC application layer provides for cross-chain interactions. To achieve this unified interface though, there are a number of differences under the hood compared to a 'regular' IBC client (excluding ",(0,n.jsx)(t.code,{children:"06-solomachine"})," and ",(0,n.jsx)(t.code,{children:"09-localhost"})," itself)."]}),"\n",(0,n.jsx)(t.p,{children:"The table below lists some important differences:"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{}),(0,n.jsx)(t.th,{children:"Regular client"}),(0,n.jsx)(t.th,{children:"Localhost"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Number of clients"}),(0,n.jsxs)(t.td,{children:["Many instances of a client ",(0,n.jsx)(t.em,{children:"type"})," corresponding to different counterparties"]}),(0,n.jsxs)(t.td,{children:["A single sentinel client with the client identifier ",(0,n.jsx)(t.code,{children:"09-localhost"})]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Client creation"}),(0,n.jsx)(t.td,{children:"Relayer (permissionless)"}),(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.code,{children:"ClientState"})," is instantiated in the ",(0,n.jsx)(t.code,{children:"InitGenesis"})," handler of the 02-client submodule in core IBC"]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Client updates"}),(0,n.jsxs)(t.td,{children:["Relayer submits headers using ",(0,n.jsx)(t.code,{children:"MsgUpdateClient"})]}),(0,n.jsxs)(t.td,{children:["Latest height is updated periodically through the ABCI ",(0,n.jsx)(t.a,{href:"https://docs.cosmos.network/v0.47/building-modules/beginblock-endblock",children:(0,n.jsx)(t.code,{children:"BeginBlock"})})," interface of the 02-client submodule in core IBC"]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Number of connections"}),(0,n.jsx)(t.td,{children:"Many connections, 1 (or more) per client"}),(0,n.jsxs)(t.td,{children:["A single sentinel connection with the connection identifier ",(0,n.jsx)(t.code,{children:"connection-localhost"})]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Connection creation"}),(0,n.jsx)(t.td,{children:"Connection handshake, provided underlying client"}),(0,n.jsxs)(t.td,{children:["Sentinel ",(0,n.jsx)(t.code,{children:"ConnectionEnd"})," is created and set in store in the ",(0,n.jsx)(t.code,{children:"InitGenesis"})," handler of the 03-connection submodule in core IBC"]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Counterparty"}),(0,n.jsx)(t.td,{children:"Underlying client, representing another chain"}),(0,n.jsxs)(t.td,{children:["Client with identifier ",(0,n.jsx)(t.code,{children:"09-localhost"})," in same chain"]})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsxs)(t.td,{children:[(0,n.jsx)(t.code,{children:"VerifyMembership"})," and ",(0,n.jsx)(t.code,{children:"VerifyNonMembership"})]}),(0,n.jsx)(t.td,{children:"Performs proof verification using consensus state roots"}),(0,n.jsx)(t.td,{children:"Performs state verification using key-value lookups in the core IBC store"})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Integration"}),(0,n.jsxs)(t.td,{children:["Expected to register codec types using the ",(0,n.jsx)(t.code,{children:"AppModuleBasic"})," interface"]}),(0,n.jsx)(t.td,{children:"Registers codec types within the core IBC module"})]})]})]})]})}function a(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},11151:(e,t,i)=>{i.d(t,{Z:()=>c,a:()=>l});var n=i(67294);const s={},o=n.createContext(s);function l(e){const t=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),n.createElement(o.Provider,{value:t},e.children)}}}]);