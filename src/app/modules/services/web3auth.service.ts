// import { Injectable } from '@angular/core';
// import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
// import { OpenloginAdapter, OpenloginAdapterOptions } from "@web3auth/openlogin-adapter";
// import { ADAPTER_EVENTS } from "@web3auth/base";
// import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";

// @Injectable({
//   providedIn: 'root'
// })
// export class Web3authService {
//   private web3auth!: Web3Auth;
//   private openloginAdapter !: OpenloginAdapter; 
//   private openloginAdapterOptions: any = {
//     uxMode: "popup",
//   }
//   private web3AuthOptions: Web3AuthOptions = {
//     clientId: "BK3WxLec5BKDwzxYozcSbyjbR-fDf1lnz2wYvmxx5uJWK1aIkz4_N1DPi_YtAAmuCsonUIguNAG4O013PeBkdXI", // Get your Client ID from Web3Auth Dashboard
//     web3AuthNetwork: "cyan",
//     chainConfig: {
//       chainNamespace: "eip155",
//       chainId: "0x1",
//       rpcTarget: "http://130.61.30.212", // This is the mainnet RPC we have added, please pass on your own endpoint while creating an app

//     }
//   };

//   constructor() { }

//   init() {
//     this.web3auth = new Web3Auth(this.web3AuthOptions);
//     this.openloginAdapter = new OpenloginAdapter(this.openloginAdapterOptions);
//     this.web3auth.configureAdapter(this.openloginAdapter);
//     this.subscribeAuthEvents(this.web3auth);
//   }

//   subscribeAuthEvents(web3auth: Web3Auth): void {
//     web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: any) => {
//       console.log("connected to wallet", data);
//       // web3auth.provider will be available here after the user is connected
//       console.log("this.web3auth", this.web3auth);
//       console.log("this.web3auth.provider", this.web3auth.provider);
//       console.log("data", data);
//     });

//     web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
//       console.log("connecting");
//     });

//     web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
//       console.log("disconnected");
//     });

//     web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
//       console.log("error", error);
//     });

//     web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible) => {
//       console.log("is modal visible", isVisible);
//     });
//   }
// }
