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
    console.log("click")
    const dialogRef = this.dialog.open(SendGasComponent, {
      hasBackdrop: true,
      backdropClass: 'static-dialog-backdrop',
      width: '300px',
    });
  }

  openRedeemModal() {

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
    public dialogRef: MatDialogRef<SendGasComponent>,
    @Inject(MAT_DIALOG_DATA) private router: Router
  ) { }

  sendTx = (recipient: string, amount: string) => {
    const tx = {
      to: recipient,
      // Convert currency unit from ether to wei
      value: ethers.utils.parseEther(amount)
    }

    // this.wallet.sendTransaction(tx)
    //   .then((txObj) => {
    //     console.log('txHash', txObj.hash)
    //     // => 0x9c172314a693b94853b49dc057cf1cb8e529f29ce0272f451eea8f5741aa9b58
    //     // A transaction result can be checked in a etherscan with a transaction hash which can be obtained here.
    //   })

    this.dialogRef.close();
    // this.router.navigate(['/bus-routes'], { queryParams: { action } });
  };

  closeBtn(): void {
    this.dialogRef.close();
  }
}
