import { Component } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { BusRoutesService } from '../../services/api/bus-routes.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-bus-routes',
  templateUrl: './bus-routes.component.html',
  styleUrls: ['./bus-routes.component.scss']
})
export class BusRoutesComponent {
  public routes: any[] = []
  private action: string = "plot";

  constructor(private spinnerService: SpinnerService, private api: BusRoutesService, private router: Router, private AcRoute: ActivatedRoute) { }

  ngOnInit() {
    if(localStorage.getItem("user") == null) {
      this.router.navigate(['/login'])
    }
    this.action = "plot"
    this.captureParams();
    this.listRoutes();
    this.spinnerService.setLoading(false);

  }

  listRoutes() {
    this.api.list({}).subscribe(async (resp) => {
      console.log(resp)
      this.routes = resp.data;
    })
  }

  captureParams() {
    this.AcRoute.queryParams.subscribe(params => {
      const action = params['action']; // Access the value of the 'action' query parameter
      console.log(typeof action); // Output the value to the console or perform any desired logic
      if(typeof action == "string"){
        this.action = action;
      }
    });
  }

  handleClick(bus_no: string) {
    console.log(this.action)
    this.router.navigate(['/map'], {
      queryParams: {
        route: bus_no,
        action: this.action
      }
    })
    if(this.action == "share"){
      // ask confirmation modal and if yes,
      // show current coord on map along bus line
      // add timer and dist

    } else if(this.action == "view"){
      // get any event from event emitter for that bus route
      // display icons on map along bus line

    } else if(this.action == "plot"){
      // plot bus line
    } else {
      // plot
      // plot bus line

    }
  }


}
