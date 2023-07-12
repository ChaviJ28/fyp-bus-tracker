import { Component } from '@angular/core';
import { UserService } from 'src/app/modules/services/api/user.service';
import { WalletService } from 'src/app/modules/services/wallet.service';
import { SpinnerService } from '../../services/spinner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public errorText: string = "";

  constructor(private api: UserService, private walletService: WalletService, private spinner: SpinnerService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("user") != null) {
      this.router.navigate(['/home'])
    }
  }

  register(first: string, last: string, phone: string, dob: string, gender: string, password: string, confPassword: string) {

    if (confPassword.toLowerCase() === password.toLowerCase()) {
      this.errorText = "";
      this.spinner.setLoading(true);

      this.api.register(first, last, password, phone, dob, gender).subscribe((resp) => {
        console.log(resp);
        if (resp.success && resp.success == true && resp.data && resp.data.id) {

          // add user_obj in localStorage

          // create wallet
          const walletObj = this.walletService.register();
          this.api.update(resp.data.id, {
            mnemonic: walletObj.mnemonic,
            wallet_address: walletObj.address,
          }).subscribe((resp2) => {
            console.log(resp2);
            localStorage.setItem('user', JSON.stringify(resp2.data[0]));
            localStorage.setItem('wallet', JSON.stringify(walletObj.wallet));
            this.spinner.setLoading(false);
            this.router.navigate(['/home']);
          })

        } else {
          if (resp.error && resp.error[0]) {
            this.errorText = resp.error[0].message + ".(" + resp.error[0].code + ")";
          } else {
            this.errorText = "Server Error, please try again later"
          }
          this.spinner.setLoading(false);

        }
      })
    } else {
      this.errorText = "Passwords do not match"
    }
  }
}
