"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3419],{41423:(e,o,i)=>{i.r(o),i.d(o,{assets:()=>c,contentTitle:()=>r,default:()=>h,frontMatter:()=>s,metadata:()=>l,toc:()=>d});var n=i(85893),t=i(11151);const s={},r="ADR 002: Go module versioning",l={id:"adr-002-go-module-versioning",title:"ADR 002: Go module versioning",description:"Changelog",source:"@site/architecture/adr-002-go-module-versioning.md",sourceDirName:".",slug:"/adr-002-go-module-versioning",permalink:"/architecture/adr-002-go-module-versioning",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"ADR 001: Coin Source Tracing",permalink:"/architecture/adr-001-coin-source-tracing"},next:{title:"ADR 003: ICS27 Acknowledgement Format",permalink:"/architecture/adr-003-ics27-acknowledgement"}},c={},d=[{value:"Changelog",id:"changelog",level:2},{value:"Status",id:"status",level:2},{value:"Context",id:"context",level:2},{value:"Problems",id:"problems",level:3},{value:"Go module version must be incremented",id:"go-module-version-must-be-incremented",level:4},{value:"Attempting to import multiple go module versions for ibc-go",id:"attempting-to-import-multiple-go-module-versions-for-ibc-go",level:4},{value:"Potential solutions",id:"potential-solutions",level:3},{value:"Changing the protobuf definition version",id:"changing-the-protobuf-definition-version",level:4},{value:"Moving protobuf definitions to their own go module",id:"moving-protobuf-definitions-to-their-own-go-module",level:4},{value:"Decision",id:"decision",level:2},{value:"Consequences",id:"consequences",level:2},{value:"Positive",id:"positive",level:3},{value:"Negative",id:"negative",level:3},{value:"Neutral",id:"neutral",level:3}];function a(e){const o={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",strong:"strong",ul:"ul",...(0,t.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o.h1,{id:"adr-002-go-module-versioning",children:"ADR 002: Go module versioning"}),"\n",(0,n.jsx)(o.h2,{id:"changelog",children:"Changelog"}),"\n",(0,n.jsxs)(o.ul,{children:["\n",(0,n.jsx)(o.li,{children:"05/01/2022: initial draft"}),"\n"]}),"\n",(0,n.jsx)(o.h2,{id:"status",children:"Status"}),"\n",(0,n.jsx)(o.p,{children:"Accepted"}),"\n",(0,n.jsx)(o.h2,{id:"context",children:"Context"}),"\n",(0,n.jsx)(o.p,{children:"The IBC module was originally developed in the Cosmos SDK and released during the Stargate release series (v0.42).\nIt was subsequently migrated to its own repository, ibc-go.\nThe first official release on ibc-go was v1.0.0.\nv1.0.0 was decided to be used instead of v0.1.0 primarily for the following reasons:"}),"\n",(0,n.jsxs)(o.ul,{children:["\n",(0,n.jsx)(o.li,{children:"Maintaining compatibility with the IBC specification v1 requires stronger support/guarantees."}),"\n",(0,n.jsx)(o.li,{children:"Using the major, minor, and patch numbers allows for easier communication of what breaking changes are included in a release."}),"\n",(0,n.jsx)(o.li,{children:"The IBC module is being used by numerous high value projects which require stability."}),"\n"]}),"\n",(0,n.jsx)(o.h3,{id:"problems",children:"Problems"}),"\n",(0,n.jsx)(o.h4,{id:"go-module-version-must-be-incremented",children:"Go module version must be incremented"}),"\n",(0,n.jsxs)(o.p,{children:["When a Go module is released under v1.0.0, all following releases must follow Go semantic versioning.\nThus when the go API is broken, the Go module major version ",(0,n.jsx)(o.strong,{children:"must"})," be incremented.\nFor example, changing the go package version from ",(0,n.jsx)(o.code,{children:"v2"})," to ",(0,n.jsx)(o.code,{children:"v3"})," bumps the import from ",(0,n.jsx)(o.code,{children:"github.com/cosmos/ibc-go/v2"})," to ",(0,n.jsx)(o.code,{children:"github.com/cosmos/ibc-go/v3"}),"."]}),"\n",(0,n.jsxs)(o.p,{children:["If the Go module version is not incremented then attempting to go get a module @v3.0.0 without the suffix results in:\n",(0,n.jsx)(o.code,{children:"invalid version: module contains a go.mod file, so major version must be compatible: should be v0 or v1, not v3"})]}),"\n",(0,n.jsxs)(o.p,{children:["Version validation was added in Go 1.13. This means that in order to release a v3.0.0 git tag without a /v3 suffix on the module definition, the tag must explicitly ",(0,n.jsx)(o.strong,{children:"not"})," contain a go.mod file.\nNot including a go.mod in our release is not a viable option."]}),"\n",(0,n.jsx)(o.h4,{id:"attempting-to-import-multiple-go-module-versions-for-ibc-go",children:"Attempting to import multiple go module versions for ibc-go"}),"\n",(0,n.jsxs)(o.p,{children:["Attempting to import two versions of ibc-go, such as ",(0,n.jsx)(o.code,{children:"github.com/cosmos/ibc-go/v2"})," and ",(0,n.jsx)(o.code,{children:"github.com/cosmos/ibc-go/v3"}),", will result in multiple issues."]}),"\n",(0,n.jsx)(o.p,{children:"The Cosmos SDK does global registration of error and governance proposal types.\nThe errors and proposals used in ibc-go would need to now register their naming based on the go module version."}),"\n",(0,n.jsx)(o.p,{children:"The more concerning problem is that protobuf definitions will also reach a namespace collision.\nibc-go and the Cosmos SDK in general rely heavily on using extended functions for go structs generated from protobuf definitions.\nThis requires the go structs to be defined in the same package as the extended functions.\nThus, bumping the import versioning causes the protobuf definitions to be generated in two places (in v2 and v3).\nWhen registering these types at compile time, the go compiler will panic.\nThe generated types need to be registered against the proto codec, but there exist two definitions for the same name."}),"\n",(0,n.jsxs)(o.p,{children:["The protobuf conflict policy can be overridden via the environment variable ",(0,n.jsx)(o.code,{children:"GOLANG_PROTOBUF_REGISTRATION_CONFLICT"}),", but it is possible this could lead to various runtime errors or unexpected behaviour (see ",(0,n.jsx)(o.a,{href:"https://github.com/protocolbuffers/protobuf-go/blob/master/reflect/protoregistry/registry.go#L46",children:"here"}),").\nMore information ",(0,n.jsx)(o.a,{href:"https://developers.google.com/protocol-buffers/docs/reference/go/faq#namespace-conflict",children:"here"})," on namespace conflicts for protobuf versioning."]}),"\n",(0,n.jsx)(o.h3,{id:"potential-solutions",children:"Potential solutions"}),"\n",(0,n.jsx)(o.h4,{id:"changing-the-protobuf-definition-version",children:"Changing the protobuf definition version"}),"\n",(0,n.jsx)(o.p,{children:"The protobuf definitions all have a type URL containing the protobuf version for this type.\nChanging the protobuf version would solve the namespace collision which arise from importing multiple versions of ibc-go, but it leads to new issues."}),"\n",(0,n.jsxs)(o.p,{children:["In the Cosmos SDK, ",(0,n.jsx)(o.code,{children:"Any"}),"s are unpacked and decoded using the type URL.\nChanging the type URL thus is creating a distinctly different type.\nThe same registration on the proto codec cannot be used to unpack the new type.\nFor example:"]}),"\n",(0,n.jsxs)(o.p,{children:["All Cosmos SDK messages are packed into ",(0,n.jsx)(o.code,{children:"Any"}),"s. If we incremented the protobuf version for our IBC messages, clients which submitted the v1 of our Cosmos SDK messages would now be rejected since the old type is not registered on the codec.\nThe clients must know to submit the v2 of these messages. This pushes the burden of versioning onto relayers and wallets."]}),"\n",(0,n.jsxs)(o.p,{children:["A more serious problem is that the ",(0,n.jsx)(o.code,{children:"ClientState"})," and ",(0,n.jsx)(o.code,{children:"ConsensusState"})," are packed as ",(0,n.jsx)(o.code,{children:"Any"}),"s. Changing the protobuf versioning of these types would break compatibility with IBC specification v1."]}),"\n",(0,n.jsx)(o.h4,{id:"moving-protobuf-definitions-to-their-own-go-module",children:"Moving protobuf definitions to their own go module"}),"\n",(0,n.jsx)(o.p,{children:"The protobuf definitions could be moved to their own go module which uses 0.x versioning and will never go to 1.0.\nThis prevents the Go module version from being incremented with breaking changes.\nIt also requires all extended functions to live in the same Go module, disrupting the existing code structure."}),"\n",(0,n.jsx)(o.p,{children:"The version that implements this change will still be incompatible with previous versions, but future versions could be imported together without namespace collisions.\nFor example, let's say this solution is implemented in v3. Then"}),"\n",(0,n.jsxs)(o.p,{children:[(0,n.jsx)(o.code,{children:"github.com/cosmos/ibc-go/v2"})," cannot be imported with any other ibc-go version"]}),"\n",(0,n.jsxs)(o.p,{children:[(0,n.jsx)(o.code,{children:"github.com/cosmos/ibc-go/v3"})," cannot be imported with any previous ibc-go versions"]}),"\n",(0,n.jsxs)(o.p,{children:[(0,n.jsx)(o.code,{children:"github.com/cosmos/ibc-go/v4"})," may be imported with ibc-go versions v3+"]}),"\n",(0,n.jsxs)(o.p,{children:[(0,n.jsx)(o.code,{children:"github.com/cosmos/ibc-go/v5"})," may be imported with ibc-go versions v3+"]}),"\n",(0,n.jsx)(o.h2,{id:"decision",children:"Decision"}),"\n",(0,n.jsx)(o.p,{children:"Supporting importing multiple versions of ibc-go requires a non-trivial amount of complexity.\nIt is unclear when a user of the ibc-go code would need multiple versions of ibc-go.\nUntil there is an overwhelming reason to support importing multiple versions of ibc-go:"}),"\n",(0,n.jsxs)(o.p,{children:[(0,n.jsx)(o.strong,{children:"Major releases cannot be imported simultaneously"}),".\nReleases should focus on keeping backwards compatibility for go code clients, within reason.\nOld functionality should be marked as deprecated and there should exist upgrade paths between major versions.\nDeprecated functionality may be removed when no clients rely on that functionality.\nHow this is determined is to be decided."]}),"\n",(0,n.jsxs)(o.p,{children:[(0,n.jsx)(o.strong,{children:"Error and proposal type registration will not be changed between go module version increments"}),".\nThis explicitly stops external clients from trying to import two major versions (potentially risking a bug due to the instability of proto name collisions override)."]}),"\n",(0,n.jsx)(o.h2,{id:"consequences",children:"Consequences"}),"\n",(0,n.jsx)(o.p,{children:"This only affects clients relying directly on the go code."}),"\n",(0,n.jsx)(o.h3,{id:"positive",children:"Positive"}),"\n",(0,n.jsx)(o.h3,{id:"negative",children:"Negative"}),"\n",(0,n.jsx)(o.p,{children:"Multiple ibc-go versions cannot be imported."}),"\n",(0,n.jsx)(o.h3,{id:"neutral",children:"Neutral"})]})}function h(e={}){const{wrapper:o}={...(0,t.a)(),...e.components};return o?(0,n.jsx)(o,{...e,children:(0,n.jsx)(a,{...e})}):a(e)}},11151:(e,o,i)=>{i.d(o,{Z:()=>l,a:()=>r});var n=i(67294);const t={},s=n.createContext(t);function r(e){const o=n.useContext(s);return n.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function l(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),n.createElement(s.Provider,{value:o},e.children)}}}]);