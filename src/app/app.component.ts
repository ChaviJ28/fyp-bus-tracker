import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, fromEvent, merge, of, Subscription } from 'rxjs';
import { map } from "rxjs/operators"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'bus-tracker';
  public networkStatus: boolean = false;
  public walletStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;
  walletStatus$: Subscription = Subscription.EMPTY;

  constructor() { }

  async ngOnInit() {
    this.checkNetworkStatus();
    // this.initializeWeb3();
  }

  ngOnDestroy(): void {
    this.networkStatus$.unsubscribe();
    this.walletStatus$.unsubscribe();
  }

  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe((status: boolean) => {
        console.log('status', status);
        this.networkStatus = status;
      });
  }

  checkWalletStatus() {
    // this.walletStatus$ = from(window.ethereum.request({ method: 'eth_requestAccounts' })).subscribe(
    //   (accounts: any) => {
    //     this.walletStatus = true;
    //     console.log(accounts);
    //   },
    //   (error: any) => {
    //     console.error(error);
    //   }
    // );
  }

  // private initializeWeb3(): void {
  //   if (typeof window.ethereum !== 'undefined') {
  //     this.checkWalletStatus();
  //   } else {
  //     // MetaMask is not available
  //     console.error('MetaMask not detected');
  //   }
  // }

}
