import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BusRoutesService } from '../../services/api/bus-routes.service';

@Component({
  selector: 'app-bus-routes',
  templateUrl: './bus-routes.component.html',
  styleUrls: ['./bus-routes.component.scss']
})
export class BusRoutesComponent {
  public routes: any[] = []

  constructor(private api: BusRoutesService, private router: Router) { }

  ngOnInit() {
    if(localStorage.getItem("user") == null) {
      this.router.navigate(['/login'])
    }
    this.listRoutes();
  }

  listRoutes() {
    this.api.list({}).subscribe(async (resp) => {
      console.log(resp)
    })
  }


}
