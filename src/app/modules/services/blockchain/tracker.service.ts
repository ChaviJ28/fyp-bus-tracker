import { EventEmitter, Injectable, Provider } from '@angular/core';
import { WalletAuthService } from '../wallet-auth.service';
import { Contract, ContractTransaction, Transaction, Wallet, ethers } from 'ethers';
import jsonAbi from '../../../../assets/abi/tracker.json';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  private address: string = "0x8D100F09A6e14FE1537204B39A563a5e19aB45E2";
  private abi: any = jsonAbi;
  public contract: Contract | any;
  public baseProvider = ethers.getDefaultProvider();
  myEvent: EventEmitter<any> = new EventEmitter();

  constructor(public walletAuthService: WalletAuthService) {
    this.ngOnInit();
  }

  async ngOnInit() {
    this.contract = new ethers.Contract(this.address, this.abi);
    console.log("contract", this.contract)
    // this.contract = this.contract.connect()
    this.contract = new ethers.Contract(this.address, this.abi, this.walletAuthService.ethWallet);
    console.log("signed contract", this.contract);
  }

  public async track(_x: string, _y: string, _busId: string) {
    
    const data = await this.contract.track(_x, _y, _busId, {
      gasLimit: 50000,
    })
    console.log("track data", data);
    this.decodeTxData(data)
    return data;
  }

  public async initSubscription() {
    const subs = this.walletAuthService.ethProvider.on('block', async (blockNumber) => {
      try {
        const logs = await this.walletAuthService.ethProvider.getLogs({
          address: this.address,
          // topics: ,
          // fromBlock: blockNumber,
          // toBlock: blockNumber,
        });

        logs.forEach((log) => {
          // Code from here would be run immediately when event appeared
          console.log('Event received', log);
          this.decodeLog(log)
        });
      } catch (error) {
        console.log(error);
      }
    });

  }

  private async decodeLog(trxData: any) {

    const iface = new ethers.utils.Interface(this.abi);
    const decodedData = iface.decodeEventLog('Track', trxData.data, trxData.topics);

    console.log('Decoded log data:', decodedData);
    this.myEvent.emit(decodedData);

  }

  private async decodeTxData(trxData: any) {

    const iface = new ethers.utils.Interface(this.abi);
    const decodedData = iface.decodeFunctionData('track', trxData.data);

    console.log('Decoded txData:', decodedData);
  }


}
