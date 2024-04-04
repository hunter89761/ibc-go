"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3145],{93898:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>o,metadata:()=>c,toc:()=>s});var n=t(85893),r=t(11151);const o={title:"Integration",sidebar_label:"Integration",sidebar_position:2,slug:"/middleware/callbacks/integration"},i="Integration",c={id:"middleware/callbacks/integration",title:"Integration",description:"Learn how to integrate the callbacks middleware with IBC applications. The following document is intended for developers building on top of the Cosmos SDK and only applies for Cosmos SDK chains.",source:"@site/versioned_docs/version-v8.1.x/04-middleware/02-callbacks/02-integration.md",sourceDirName:"04-middleware/02-callbacks",slug:"/middleware/callbacks/integration",permalink:"/v8/middleware/callbacks/integration",draft:!1,unlisted:!1,tags:[],version:"v8.1.x",sidebarPosition:2,frontMatter:{title:"Integration",sidebar_label:"Integration",sidebar_position:2,slug:"/middleware/callbacks/integration"},sidebar:"defaultSidebar",previous:{title:"Overview",permalink:"/v8/middleware/callbacks/overview"},next:{title:"Interfaces",permalink:"/v8/middleware/callbacks/interfaces"}},l={},s=[{value:"Pre-requisite Readings",id:"pre-requisite-readings",level:2},{value:"Configuring an application stack with the callbacks middleware",id:"configuring-an-application-stack-with-the-callbacks-middleware",level:2},{value:"Transfer",id:"transfer",level:3},{value:"Interchain Accounts Controller",id:"interchain-accounts-controller",level:3}];function d(e){const a={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(a.h1,{id:"integration",children:"Integration"}),"\n",(0,n.jsx)(a.p,{children:"Learn how to integrate the callbacks middleware with IBC applications. The following document is intended for developers building on top of the Cosmos SDK and only applies for Cosmos SDK chains."}),"\n",(0,n.jsx)(a.p,{children:"The callbacks middleware is a minimal and stateless implementation of the IBC middleware interface. It does not have a keeper, nor does it store any state. It simply routes IBC middleware messages to the appropriate callback function, which is implemented by the secondary application. Therefore, it doesn't need to be registered as a module, nor does it need to be added to the module manager. It only needs to be added to the IBC application stack."}),"\n",(0,n.jsx)(a.h2,{id:"pre-requisite-readings",children:"Pre-requisite Readings"}),"\n",(0,n.jsxs)(a.ul,{children:["\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"/v8/ibc/middleware/develop",children:"IBC middleware development"})}),"\n",(0,n.jsx)(a.li,{children:(0,n.jsx)(a.a,{href:"/v8/ibc/middleware/integration",children:"IBC middleware integration"})}),"\n"]}),"\n",(0,n.jsxs)(a.p,{children:["The callbacks middleware, as the name suggests, plays the role of an IBC middleware and as such must be configured by chain developers to route and handle IBC messages correctly.\nFor Cosmos SDK chains this setup is done via the ",(0,n.jsx)(a.code,{children:"app/app.go"})," file, where modules are constructed and configured in order to bootstrap the blockchain application."]}),"\n",(0,n.jsx)(a.h2,{id:"configuring-an-application-stack-with-the-callbacks-middleware",children:"Configuring an application stack with the callbacks middleware"}),"\n",(0,n.jsxs)(a.p,{children:["As mentioned in ",(0,n.jsx)(a.a,{href:"/v8/ibc/middleware/develop",children:"IBC middleware development"})," an application stack may be composed of many or no middlewares that nest a base application.\nThese layers form the complete set of application logic that enable developers to build composable and flexible IBC application stacks.\nFor example, an application stack may just be a single base application like ",(0,n.jsx)(a.code,{children:"transfer"}),", however, the same application stack composed with ",(0,n.jsx)(a.code,{children:"29-fee"})," and ",(0,n.jsx)(a.code,{children:"callbacks"})," will nest the ",(0,n.jsx)(a.code,{children:"transfer"})," base application twice by wrapping it with the Fee Middleware module and then callbacks middleware."]}),"\n",(0,n.jsxs)(a.p,{children:["The callbacks middleware also ",(0,n.jsx)(a.strong,{children:"requires"})," a secondary application that will receive the callbacks to implement the ",(0,n.jsx)(a.a,{href:"https://github.com/cosmos/ibc-go/blob/v7.3.0/modules/apps/callbacks/types/expected_keepers.go#L11-L83",children:(0,n.jsx)(a.code,{children:"ContractKeeper"})}),". Since the wasm module does not yet support the callbacks middleware, we will use the ",(0,n.jsx)(a.code,{children:"mockContractKeeper"})," module in the examples below. You should replace this with a module that implements ",(0,n.jsx)(a.code,{children:"ContractKeeper"}),"."]}),"\n",(0,n.jsx)(a.h3,{id:"transfer",children:"Transfer"}),"\n",(0,n.jsxs)(a.p,{children:["See below for an example of how to create an application stack using ",(0,n.jsx)(a.code,{children:"transfer"}),", ",(0,n.jsx)(a.code,{children:"29-fee"}),", and ",(0,n.jsx)(a.code,{children:"callbacks"}),". Feel free to omit the ",(0,n.jsx)(a.code,{children:"29-fee"})," middleware if you do not want to use it.\nThe following ",(0,n.jsx)(a.code,{children:"transferStack"})," is configured in ",(0,n.jsx)(a.code,{children:"app/app.go"})," and added to the IBC ",(0,n.jsx)(a.code,{children:"Router"}),".\nThe in-line comments describe the execution flow of packets between the application stack and IBC core."]}),"\n",(0,n.jsx)(a.pre,{children:(0,n.jsx)(a.code,{className:"language-go",children:"// Create Transfer Stack\n// SendPacket, since it is originating from the application to core IBC:\n// transferKeeper.SendPacket -> callbacks.SendPacket -> feeKeeper.SendPacket -> channel.SendPacket\n\n// RecvPacket, message that originates from core IBC and goes down to app, the flow is the other way\n// channel.RecvPacket -> fee.OnRecvPacket -> callbacks.OnRecvPacket -> transfer.OnRecvPacket\n\n// transfer stack contains (from top to bottom):\n// - IBC Fee Middleware\n// - IBC Callbacks Middleware\n// - Transfer\n\n// create IBC module from bottom to top of stack\nvar transferStack porttypes.IBCModule\ntransferStack = transfer.NewIBCModule(app.TransferKeeper)\ntransferStack = ibccallbacks.NewIBCMiddleware(transferStack, app.IBCFeeKeeper, app.MockContractKeeper, maxCallbackGas)\ntransferICS4Wrapper := transferStack.(porttypes.ICS4Wrapper)\ntransferStack = ibcfee.NewIBCMiddleware(transferStack, app.IBCFeeKeeper)\n// Since the callbacks middleware itself is an ics4wrapper, it needs to be passed to the transfer keeper\napp.TransferKeeper.WithICS4Wrapper(transferICS4Wrapper)\n\n// Add transfer stack to IBC Router\nibcRouter.AddRoute(ibctransfertypes.ModuleName, transferStack)\n"})}),"\n",(0,n.jsxs)(a.p,{children:["::: warning\nThe usage of ",(0,n.jsx)(a.code,{children:"WithICS4Wrapper"})," after ",(0,n.jsx)(a.code,{children:"transferStack"}),"'s configuration is critical! It allows the callbacks middleware to do ",(0,n.jsx)(a.code,{children:"SendPacket"})," callbacks and asynchronous ",(0,n.jsx)(a.code,{children:"ReceivePacket"})," callbacks. You must do this regardless of whether you are using the ",(0,n.jsx)(a.code,{children:"29-fee"})," middleware or not.\n:::"]}),"\n",(0,n.jsx)(a.h3,{id:"interchain-accounts-controller",children:"Interchain Accounts Controller"}),"\n",(0,n.jsx)(a.pre,{children:(0,n.jsx)(a.code,{className:"language-go",children:'// Create Interchain Accounts Stack\n// SendPacket, since it is originating from the application to core IBC:\n// icaControllerKeeper.SendTx -> callbacks.SendPacket -> fee.SendPacket -> channel.SendPacket\n\n// initialize ICA module with mock module as the authentication module on the controller side\nvar icaControllerStack porttypes.IBCModule\nicaControllerStack = ibcmock.NewIBCModule(&mockModule, ibcmock.NewIBCApp("", scopedICAMockKeeper))\napp.ICAAuthModule = icaControllerStack.(ibcmock.IBCModule)\nicaControllerStack = icacontroller.NewIBCMiddleware(icaControllerStack, app.ICAControllerKeeper)\nicaControllerStack = ibccallbacks.NewIBCMiddleware(icaControllerStack, app.IBCFeeKeeper, app.MockContractKeeper, maxCallbackGas)\nicaICS4Wrapper := icaControllerStack.(porttypes.ICS4Wrapper)\nicaControllerStack = ibcfee.NewIBCMiddleware(icaControllerStack, app.IBCFeeKeeper)\n// Since the callbacks middleware itself is an ics4wrapper, it needs to be passed to the ica controller keeper\napp.ICAControllerKeeper.WithICS4Wrapper(icaICS4Wrapper)\n\n// RecvPacket, message that originates from core IBC and goes down to app, the flow is:\n// channel.RecvPacket -> fee.OnRecvPacket -> icaHost.OnRecvPacket\n\nvar icaHostStack porttypes.IBCModule\nicaHostStack = icahost.NewIBCModule(app.ICAHostKeeper)\nicaHostStack = ibcfee.NewIBCMiddleware(icaHostStack, app.IBCFeeKeeper)\n\n// Add ICA host and controller to IBC router ibcRouter.\nAddRoute(icacontrollertypes.SubModuleName, icaControllerStack).\nAddRoute(icahosttypes.SubModuleName, icaHostStack).\n'})}),"\n",(0,n.jsxs)(a.p,{children:["::: warning\nThe usage of ",(0,n.jsx)(a.code,{children:"WithICS4Wrapper"})," here is also critical!\n:::"]})]})}function p(e={}){const{wrapper:a}={...(0,r.a)(),...e.components};return a?(0,n.jsx)(a,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},11151:(e,a,t)=>{t.d(a,{Z:()=>c,a:()=>i});var n=t(67294);const r={},o=n.createContext(r);function i(e){const a=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function c(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),n.createElement(o.Provider,{value:a},e.children)}}}]);