import { Injectable } from '@angular/core';
import { Wallet } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private wallet!: Wallet;
  private mnemonicStr!: any;
  private mnemonic!: string[];
  public testWords!: { word: string, index: number }[];

  constructor() { }

  public register() {
    this.wallet = Wallet.createRandom();
    // console.log("this.wallet2", this.wallet);
    this.mnemonicStr = this.wallet.mnemonic;
    // console.log("this.mnemonicStr", this.mnemonicStr);
    this.mnemonic = this.mnemonicStr.phrase.split(' ');
    // console.log("this.mnemonic", this.mnemonic);
    this.createWallet();
    return {
      mnemonic: this.wallet.mnemonic.phrase,
      address: this.wallet.address,
      wallet: this.wallet
    }
  }

  public createTestWords(amount: number) {
    const mnemonic = [...this.mnemonic];
    this.testWords = Array(amount)
      .fill('')
      .map(_ => {
        const rand = Math.floor(Math.random() * mnemonic.length);
        const word = mnemonic.splice(rand)[0];
        const index = this.mnemonic.indexOf(word);
        return { word, index };
      })
      .sort((a, b) => a.index - b.index);
  }

  private async encryptPrivatekey(password: string) {
    const keystore = await this.wallet.encrypt(password);
    console.log(keystore);
    localStorage.setItem('keystore', keystore);
  }

  public createWallet() {
    // if (this.passwordForm.valid) {
      if (true) {
      // const pwd = this.passwordForm.get('pwd').value;
      const pwd = "test";
      this.encryptPrivatekey(pwd);
    }
  }
}
