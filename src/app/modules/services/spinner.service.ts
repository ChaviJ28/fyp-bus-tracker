import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  isLoading$ = new BehaviorSubject<boolean>(false);
  
  setLoading(isLoading: boolean) {
    this.isLoading$.next(isLoading);
  }
}