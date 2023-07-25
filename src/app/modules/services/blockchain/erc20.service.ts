import { Injectable, Provider } from '@angular/core';
import { WalletAuthService } from '../wallet-auth.service';
import { Contract, Wallet, ethers } from 'ethers';
import  jsonAbi from '../../../../assets/abi/erc20.json';

@Injectable({
  providedIn: 'root'
})
export class Erc20Service {
  private address: string = "0x578Fee13De5944A079bF4Fbf9DD0869bC1279006";
  private abi: any = jsonAbi;
  public contract: Contract | any;

  constructor(public walletAuthService: WalletAuthService) {
    this.ngOnInit();
  }

  async ngOnInit(){
    this.contract = new ethers.Contract(this.address, this.abi);
    console.log("contract", this.contract)
    // this.contract = this.contract.connect()
    this.contract = new ethers.Contract(this.address, this.abi, this.walletAuthService.ethProvider);
    console.log("signed contract", this.contract)
  }

  public async getBalance(){
    const balance = await this.contract.balanceOf(JSON.parse(localStorage.getItem("wallet")!).address)
    const decimal = await this.contract.decimals()
    return (parseInt(balance) / Math.pow(10, decimal)).toString();
  }

}
