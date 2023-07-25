import { Component } from '@angular/core';
import { WalletAuthService } from '../../services/wallet-auth.service';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent extends HomeComponent {

  override async ngOnInit() {
    this.getUserDetails();
    await this.walletAuthService.initWallet();
    await this.initTokenContract();
    await this.getBalance();
    console.log(this.userDetails, "userDetails");
  }

  openSendModal() {

  }

  openRedeemModal() {
    
  }

}
