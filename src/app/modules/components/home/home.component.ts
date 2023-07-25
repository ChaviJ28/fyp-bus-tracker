import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { WalletService } from 'src/app/modules/services/wallet.service';
import { WalletAuthService } from 'src/app/modules/services/wallet-auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { Subscription, interval } from 'rxjs';
import { Erc20Service } from '../../services/blockchain/erc20.service';
import { TrackerService } from '../../services/blockchain/tracker.service';
// import { Web3authService } from 'src/app/modules/services/web3auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public balance = "0";
  public ethBalance = "0";
  public userDetails: any;
  public subscription: Subscription | any;
  public ercToken!: Erc20Service;
  public tokenBalance = "";


  constructor(private appComponent: AppComponent, private clipboard: Clipboard, public spinnerService: SpinnerService, public walletAuthService: WalletAuthService, public router: Router, private token: Erc20Service) {
    // constructor(private appComponent: AppComponent){
  }

  async ngOnInit() {
    // this.handleWalletClick();
    this.spinnerService.setLoading(true);
    const status = await this.walletAuthService.initWallet();
    if (status == true) {
      await this.initTokenContract();
      // console.log(await this.ercToken.getBalance())
      this.getUserDetails();
      await this.getBalance();

      const source = interval(30000); // 1 min == 60sec
      this.subscription = source.subscribe(() => this.getBalance());
    } else {
      this.router.navigate(['/login']);
    }
    this.spinnerService.setLoading(false);

  }

  ngOnDestroy() {
    if(this.subscription != null){
      this.subscription.unsubscribe();
    }
  }

  getUserDetails() {
    this.userDetails = JSON.parse(localStorage.getItem('user')!)
  }

  getGenderTitle() {
    if (this.userDetails && this.userDetails.gender) { }
  }

  public handleWalletClick(event: any) {
    // this.web3authService.init();
    // this.walletService.randomMnemonic();
    // this.walletService.createWallet();

    // this.spinner.setLoading(true);
    // this.walletAuthService.login("test");
  }

  public getNetworkStatus(): boolean {
    // console.log(this.appComponent.networkStatus)
    // return this.appComponent.networkStatus ? '#00ff00' : 'red';
    return this.appComponent.networkStatus;
  }

  public getWalletAddress(): string {
    try {
      return JSON.parse(localStorage.getItem('wallet')!).address
    } catch (error) {
      this.logout();
      this.router.navigate(['/login']);
      return ""
    }
  }

  public logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("wallet");
  }

  public copyWalletAddress() {
    this.clipboard.copy(this.getWalletAddress());
  }

  public async getBalance() {
    this.balance = await this.walletAuthService.getBalance();
    console.log(this.balance);
    this.ethBalance = await this.walletAuthService.getEthBalance();
    console.log(this.ethBalance);
    this.tokenBalance = await this.ercToken.getBalance();
    console.log("token balance: ", this.tokenBalance)
  }

  public async initTokenContract() {
    this.ercToken = new Erc20Service(this.walletAuthService)
  }

}
