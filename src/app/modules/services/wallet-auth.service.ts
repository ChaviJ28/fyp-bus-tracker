import { Injectable } from '@angular/core';
import { Wallet, ethers } from 'ethers';
import { SpinnerService } from './spinner.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

// import { TransactionRequest } from 'ethers/providers';
// import { TransactionResponse, TransactionRequest, TransactionReceipt } from 'ethers/providers/provider';

@Injectable({
  providedIn: 'root'
})
export class WalletAuthService {

  public ethWallet!: Wallet | any;
  public ethProvider!: ethers.providers.BaseProvider;
  public ethSubscription: Subscription | any;

  public wallet!: Wallet | any;
  public provider!: ethers.providers.BaseProvider;
  public subscription: Subscription | any;

  constructor(public spinner: SpinnerService, private router: Router) { }

  public async login(password: string, mnemonic: string) {
    try {
      // const keystore = (localStorage.getItem('keystore') as string);
      // console.log("keystore", keystore);
      // this.provider = new ethers.providers.JsonRpcProvider("wss://130.61.30.212:8546");
      
      // this.provider = new ethers.providers.JsonRpcProvider("http://load.horizonafrica.io:8085/");
      
      // console.log("this.provider", this.provider);
      var wallet = await Wallet.fromMnemonic(mnemonic);
      // console.log("wallet", wallet);
      localStorage.setItem('wallet', JSON.stringify(wallet));
      // wallet = wallet.connect(this.provider);
      this.wallet = wallet;

      // console.log("this.wallet", this.wallet);
      // console.log("this.getBalance", await this.getBalance());

      // connect to ETH blockchain
      this.initEthWallet();
      console.log("this.getEthBalance", await this.getEthBalance());

    } catch (err: any) {
      console.log("err", err);
      throw new Error(err);
    }
  }

  private async initEthWallet() {
    // https://ethereum-goerli-rpc.allthatnode.com/
    this.ethProvider = new ethers.providers.JsonRpcProvider("https://ethereum-goerli-rpc.allthatnode.com/");
    // console.log("this.ethProvider", this.ethProvider);
    this.ethWallet = this.wallet.connect(this.ethProvider);
    // console.log("this.wallet", this.ethWallet);
    // console.log("this.getBalance", await this.getBalance());
  }

  // public async getBalance() {
  //   const balance = await this.wallet.getBalance();
  //   console.log("balance", balance);
  //   return ethers.utils.formatEther(balance).toString();
  // }

  public async initWallet() {
    console.log("user", localStorage.getItem("user"));
    if (localStorage.getItem("user") != null) {
      console.log("has user");
      this.login("test", JSON.parse(localStorage.getItem('user')!).mnemonic);
      return true;
    } else {
      console.log("should go to login");
      this.router.navigate(['/login']);
      return false;
    }
  }

  public async getBalance() {
    try {
      const balance = await this.wallet?.getBalance();
      console.log("balance", balance);
      return ethers.utils.formatEther(balance).toString();
    } catch (err) {
      return "0";
    }
  }

  public async getEthBalance() {
    try {
      const balance = await this.ethWallet?.getBalance();
      console.log("balance", balance);
      return ethers.utils.formatEther(balance).toString();
    } catch (err) {
      console.log("err", err)
      return "0";
    }
  }

  // public sendTx({ to, value }: any) {
  //   return this.wallet.sendTransaction({
  //     to,
  //     value: ethers.utils.parseEther(value.toString())
  //   });
  // }

}
