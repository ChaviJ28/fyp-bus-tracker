import { Component, Inject } from '@angular/core';
import { WalletAuthService } from '../../services/wallet-auth.service';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ethers } from 'ethers';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    const dialogRef = this.dialog.open(SendGasComponent, {
      hasBackdrop: true,
      backdropClass: 'static-dialog-backdrop',
      width: '300px',
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      await this.getBalance();
    });
  }

  openRedeemModal() {
    const dialogRef = this.dialog.open(RedeemComponent, {
      hasBackdrop: true,
      backdropClass: 'static-dialog-backdrop',
      width: '300px',
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      await this.getBalance();
    });
  }

}


@Component({
  selector: 'app-send-gas',
  templateUrl: './send-gas.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [MatDialogModule],
})
export class SendGasComponent {
  constructor(
    public dialogRef: MatDialogRef<SendGasComponent>, private walletAuthService: WalletAuthService,
    @Inject(MAT_DIALOG_DATA) private router: Router
  ) { }

  sendTx = async (recipient: string, amount: string) => {

    await this.walletAuthService.sendTransaction(recipient, amount);

    this.dialogRef.close();
    // this.router.navigate(['/bus-routes'], { queryParams: { action } });
  };

  closeBtn(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-redeem',
  templateUrl: './redeem-token.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [MatDialogModule],
})
export class RedeemComponent {
  constructor(
    public dialogRef: MatDialogRef<RedeemComponent>, @Inject(MAT_DIALOG_DATA) private router: Router, 
  ) { }

  sendTx = async (recipient: string, amount: string) => {


    this.dialogRef.close();
    // this.router.navigate(['/bus-routes'], { queryParams: { action } });
  };

  closeBtn(): void {
    this.dialogRef.close();
  }
}
