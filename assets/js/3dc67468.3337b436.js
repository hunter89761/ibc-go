"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3318],{68623:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>a,default:()=>l,frontMatter:()=>s,metadata:()=>o,toc:()=>h});var i=n(85893),r=n(11151);const s={title:"How to Upgrade IBC Chains and their Clients",sidebar_label:"How to Upgrade IBC Chains and their Clients",sidebar_position:1,slug:"/ibc/upgrades/quick-guide"},a="How to Upgrade IBC Chains and their Clients",o={id:"ibc/upgrades/quick-guide",title:"How to Upgrade IBC Chains and their Clients",description:"Learn how to upgrade your chain and counterparty clients.",source:"@site/versioned_docs/version-v5.3.x/01-ibc/05-upgrades/01-quick-guide.md",sourceDirName:"01-ibc/05-upgrades",slug:"/ibc/upgrades/quick-guide",permalink:"/v5/ibc/upgrades/quick-guide",draft:!1,unlisted:!1,tags:[],version:"v5.3.x",sidebarPosition:1,frontMatter:{title:"How to Upgrade IBC Chains and their Clients",sidebar_label:"How to Upgrade IBC Chains and their Clients",sidebar_position:1,slug:"/ibc/upgrades/quick-guide"},sidebar:"defaultSidebar",previous:{title:"intro",permalink:"/v5/ibc/upgrades/intro"},next:{title:"IBC Client Developer Guide to Upgrades",permalink:"/v5/ibc/upgrades/developer-guide"}},d={},h=[{value:"IBC Client Breaking Upgrades",id:"ibc-client-breaking-upgrades",level:2},{value:"Step-by-Step Upgrade Process for SDK chains",id:"step-by-step-upgrade-process-for-sdk-chains",level:3},{value:"Step-by-Step Upgrade Process for Relayers Upgrading Counterparty Clients",id:"step-by-step-upgrade-process-for-relayers-upgrading-counterparty-clients",level:3}];function c(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",strong:"strong",...(0,r.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"how-to-upgrade-ibc-chains-and-their-clients",children:"How to Upgrade IBC Chains and their Clients"}),"\n",(0,i.jsx)(t.admonition,{title:"Synopsis",type:"note",children:(0,i.jsx)(t.p,{children:"Learn how to upgrade your chain and counterparty clients."})}),"\n",(0,i.jsx)(t.p,{children:"The information in this doc for upgrading chains is relevant to SDK chains. However, the guide for counterparty clients is relevant to any Tendermint client that enables upgrades."}),"\n",(0,i.jsx)(t.h2,{id:"ibc-client-breaking-upgrades",children:"IBC Client Breaking Upgrades"}),"\n",(0,i.jsx)(t.p,{children:"IBC-connected chains must perform an IBC upgrade if their upgrade will break counterparty IBC clients. The current IBC protocol supports upgrading tendermint chains for a specific subset of IBC-client-breaking upgrades. Here is the exhaustive list of IBC client-breaking upgrades and whether the IBC protocol currently supports such upgrades."}),"\n",(0,i.jsxs)(t.p,{children:["IBC currently does ",(0,i.jsx)(t.strong,{children:"NOT"})," support unplanned upgrades. All of the following upgrades must be planned and committed to in advance by the upgrading chain, in order for counterparty clients to maintain their connections securely."]}),"\n",(0,i.jsx)(t.p,{children:"Note: Since upgrades are only implemented for Tendermint clients, this doc only discusses upgrades on Tendermint chains that would break counterparty IBC Tendermint Clients."}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:["Changing the Chain-ID: ",(0,i.jsx)(t.strong,{children:"Supported"})]}),"\n",(0,i.jsxs)(t.li,{children:["Changing the UnbondingPeriod: ",(0,i.jsx)(t.strong,{children:"Partially Supported"}),", chains may increase the unbonding period with no issues. However, decreasing the unbonding period may irreversibly break some counterparty clients. Thus, it is ",(0,i.jsx)(t.strong,{children:"not recommended"})," that chains reduce the unbonding period."]}),"\n",(0,i.jsxs)(t.li,{children:["Changing the height (resetting to 0): ",(0,i.jsx)(t.strong,{children:"Supported"}),", so long as chains remember to increment the revision number in their chain-id."]}),"\n",(0,i.jsxs)(t.li,{children:["Changing the ProofSpecs: ",(0,i.jsx)(t.strong,{children:"Supported"}),", this should be changed if the proof structure needed to verify IBC proofs is changed across the upgrade. Ex: Switching from an IAVL store, to a SimpleTree Store"]}),"\n",(0,i.jsxs)(t.li,{children:["Changing the UpgradePath: ",(0,i.jsx)(t.strong,{children:"Supported"}),", this might involve changing the key under which upgraded clients and consensus states are stored in the upgrade store, or even migrating the upgrade store itself."]}),"\n",(0,i.jsxs)(t.li,{children:["Migrating the IBC store: ",(0,i.jsx)(t.strong,{children:"Unsupported"}),", as the IBC store location is negotiated by the connection."]}),"\n",(0,i.jsx)(t.li,{children:"Upgrading to a backwards compatible version of IBC: Supported"}),"\n",(0,i.jsxs)(t.li,{children:["Upgrading to a non-backwards compatible version of IBC: ",(0,i.jsx)(t.strong,{children:"Unsupported"}),", as IBC version is negotiated on connection handshake."]}),"\n",(0,i.jsxs)(t.li,{children:["Changing the Tendermint LightClient algorithm: ",(0,i.jsx)(t.strong,{children:"Partially Supported"}),". Changes to the light client algorithm that do not change the ClientState or ConsensusState struct may be supported, provided that the counterparty is also upgraded to support the new light client algorithm. Changes that require updating the ClientState and ConsensusState structs themselves are theoretically possible by providing a path to translate an older ClientState struct into the new ClientState struct; however this is not currently implemented."]}),"\n"]}),"\n",(0,i.jsx)(t.h3,{id:"step-by-step-upgrade-process-for-sdk-chains",children:"Step-by-Step Upgrade Process for SDK chains"}),"\n",(0,i.jsx)(t.p,{children:"If the IBC-connected chain is conducting an upgrade that will break counterparty clients, it must ensure that the upgrade is first supported by IBC using the list above and then execute the upgrade process described below in order to prevent counterparty clients from breaking."}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsxs)(t.li,{children:["Create a 02-client ",(0,i.jsx)(t.a,{href:"https://github.com/cosmos/ibc-go/blob/v5.3.1/proto/ibc/core/client/v1/client.proto#L58-L77",children:(0,i.jsx)(t.code,{children:"UpgradeProposal"})})," with an ",(0,i.jsx)(t.code,{children:"UpgradePlan"})," and a new IBC ClientState in the ",(0,i.jsx)(t.code,{children:"UpgradedClientState"})," field. Note that the ",(0,i.jsx)(t.code,{children:"UpgradePlan"})," must specify an upgrade height ",(0,i.jsx)(t.strong,{children:"only"})," (no upgrade time), and the ",(0,i.jsx)(t.code,{children:"ClientState"})," should only include the fields common to all valid clients and zero out any client-customizable fields (such as TrustingPeriod)."]}),"\n",(0,i.jsxs)(t.li,{children:["Vote on and pass the ",(0,i.jsx)(t.code,{children:"UpgradeProposal"})]}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:["Upon the ",(0,i.jsx)(t.code,{children:"UpgradeProposal"})," passing, the upgrade module will commit the UpgradedClient under the key: ",(0,i.jsx)(t.code,{children:"upgrade/UpgradedIBCState/{upgradeHeight}/upgradedClient"}),". On the block right before the upgrade height, the upgrade module will also commit an initial consensus state for the next chain under the key: ",(0,i.jsx)(t.code,{children:"upgrade/UpgradedIBCState/{upgradeHeight}/upgradedConsState"}),"."]}),"\n",(0,i.jsxs)(t.p,{children:["Once the chain reaches the upgrade height and halts, a relayer can upgrade the counterparty clients to the last block of the old chain. They can then submit the proofs of the ",(0,i.jsx)(t.code,{children:"UpgradedClient"})," and ",(0,i.jsx)(t.code,{children:"UpgradedConsensusState"})," against this last block and upgrade the counterparty client."]}),"\n",(0,i.jsx)(t.h3,{id:"step-by-step-upgrade-process-for-relayers-upgrading-counterparty-clients",children:"Step-by-Step Upgrade Process for Relayers Upgrading Counterparty Clients"}),"\n",(0,i.jsx)(t.p,{children:"Once the upgrading chain has committed to upgrading, relayers must wait till the chain halts at the upgrade height before upgrading counterparty clients. This is because chains may reschedule or cancel upgrade plans before they occur. Thus, relayers must wait till the chain reaches the upgrade height and halts before they can be sure the upgrade will take place."}),"\n",(0,i.jsx)(t.p,{children:"Thus, the upgrade process for relayers trying to upgrade the counterparty clients is as follows:"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsx)(t.li,{children:"Wait for the upgrading chain to reach the upgrade height and halt"}),"\n",(0,i.jsxs)(t.li,{children:["Query a full node for the proofs of ",(0,i.jsx)(t.code,{children:"UpgradedClient"})," and ",(0,i.jsx)(t.code,{children:"UpgradedConsensusState"})," at the last height of the old chain."]}),"\n",(0,i.jsxs)(t.li,{children:["Update the counterparty client to the last height of the old chain using the ",(0,i.jsx)(t.code,{children:"UpdateClient"})," msg."]}),"\n",(0,i.jsxs)(t.li,{children:["Submit an ",(0,i.jsx)(t.code,{children:"UpgradeClient"})," msg to the counterparty chain with the ",(0,i.jsx)(t.code,{children:"UpgradedClient"}),", ",(0,i.jsx)(t.code,{children:"UpgradedConsensusState"})," and their respective proofs."]}),"\n",(0,i.jsxs)(t.li,{children:["Submit an ",(0,i.jsx)(t.code,{children:"UpdateClient"})," msg to the counterparty chain with a header from the new upgraded chain."]}),"\n"]}),"\n",(0,i.jsx)(t.p,{children:"The Tendermint client on the counterparty chain will verify that the upgrading chain did indeed commit to the upgraded client and upgraded consensus state at the upgrade height (since the upgrade height is included in the key). If the proofs are verified against the upgrade height, then the client will upgrade to the new client while retaining all of its client-customized fields. Thus, it will retain its old TrustingPeriod, TrustLevel, MaxClockDrift, etc; while adopting the new chain-specified fields such as UnbondingPeriod, ChainId, UpgradePath, etc. Note, this can lead to an invalid client since the old client-chosen fields may no longer be valid given the new chain-chosen fields. Upgrading chains should try to avoid these situations by not altering parameters that can break old clients. For an example, see the UnbondingPeriod example in the supported upgrades section."}),"\n",(0,i.jsxs)(t.p,{children:["The upgraded consensus state will serve purely as a basis of trust for future ",(0,i.jsx)(t.code,{children:"UpdateClientMsgs"})," and will not contain a consensus root to perform proof verification against. Thus, relayers must submit an ",(0,i.jsx)(t.code,{children:"UpdateClientMsg"})," with a header from the new chain so that the connection can be used for proof verification again."]})]})}function l(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},11151:(e,t,n)=>{n.d(t,{Z:()=>o,a:()=>a});var i=n(67294);const r={},s=i.createContext(r);function a(e){const t=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),i.createElement(s.Provider,{value:t},e.children)}}}]);