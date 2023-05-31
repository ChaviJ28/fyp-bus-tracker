import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/modules/services/api/user.service';
import { SpinnerService } from '../../services/spinner.service';
import { WalletAuthService } from '../../services/wallet-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public errorText = "";
  constructor(private api: UserService, private router: Router, public walletAuthService: WalletAuthService, private spinner: SpinnerService) { }

  ngOnInit() {
    if(localStorage.getItem("user") != null) {
      this.router.navigate(['/home'])
    }
  }

  login(phone: string, password: string) {
    this.errorText = "";
    this.spinner.setLoading(true);

    this.api.login(phone, password).subscribe(async (resp) => {
      console.log(resp);
      if (resp.success && resp.success == true && resp.data && resp.data.userObject) {
        localStorage.setItem('user', JSON.stringify(resp.data.userObject[0]));
        // localStorage.setItem('wallet', JSON.stringify({
        //   mnemonic: resp.data.userObject[0].mnemonic,
        //   address: resp.data.userObject[0].wallet_address
        // }));
        await this.walletAuthService.login("test", resp.data.userObject[0].mnemonic);
        this.spinner.setLoading(false);
        console.log("done");
        this.router.navigate(['/home']);

      } else {
        if (resp.error && resp.error[0]) {
          this.errorText = resp.error[0].message + ".(" + resp.error[0].code + ")";
        } else {
          this.errorText = "Server Error, please try again later"
        }
        this.spinner.setLoading(false);
      }

    })
  }

}
