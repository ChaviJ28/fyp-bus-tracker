import { Component, Inject, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrackerService } from '../../services/blockchain/tracker.service';
import { WalletAuthService } from '../../services/wallet-auth.service';
import { SpinnerService } from '../../services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BusRoutesService } from '../../services/api/bus-routes.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})

export class MapViewComponent implements OnInit {
  private action: string = "null";
  private addresses: string[] = [];
  private type: string = "null";
  private route: string = "null";
  private coordinates: [] = [];
  private showMap: boolean = false;
  private map: mapboxgl.Map | any;
  private style = 'mapbox://styles/mapbox/streets-v12';
  public tracker!: TrackerService;
  private geolocateControl = new mapboxgl.GeolocateControl(
    {
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: true,
      fitBoundsOptions: {
        maxZoom: 15
      }
    });

  constructor(private spinnerService: SpinnerService, private busApi: BusRoutesService, private dialog: MatDialog, private walletAuthService: WalletAuthService, private AcRoute: ActivatedRoute) { }

  async ngOnInit() {
    this.spinnerService.setLoading(true);
    mapboxgl!.accessToken = "pk.eyJ1IjoiY2hhdmktY29kZXZpZ29yIiwiYSI6ImNsaGIzdmVjNDBub3AzZXMybjViM3VqNWYifQ._FuHAP8YwUCJd2uCp_Qnaw";
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 9,
      center: [57.5865, -20.2367]
    });
    this.captureParams();

    if (this.type == "share" || this.type == "view" || this.type == "plot") {
      this.showMap = true;
      this.showRoute();

      if (this.type == "share") {
        this.startTracking();
        this.initTracker();
      }

      if (this.type == "view") {
        this.initTracker();
      }
    }

    if (this.showMap) {
      this.initMap();

    } else {
      this.spinnerService.setLoading(false);
      const dialogRef = this.dialog.open(MapSelectionComponent, {
        hasBackdrop: true,
        backdropClass: 'static-dialog-backdrop',
        width: '250px',
      });
      dialogRef.afterClosed().subscribe(result => {
        this.spinnerService.setLoading(false);
        console.log('The dialog was closed');
        this.action = result;
        console.log(result)
        if (this.action == "witness") {
          this.showMap = !this.showMap;
          this.initMap();
        }
      });
    }

  }

  private captureParams() {
    this.AcRoute.queryParams.subscribe(params => {
      const action = params['action']; // Access the value of the 'action' query parameter
      const route = params['route']; // Access the value of the 'action' query parameter
      console.log(action); // Output the value to the console or perform any desired logic
      this.type = action;
      this.route = route;
    });
  }

  private showRoute() {
    this.busApi.listCoordinates({
      search_criteria: {
        busNo: this.route
      }
    }).subscribe(async (resp) => {
      console.log(resp)
      this.coordinates = resp.data;
      this.plotRoute();
    })
  }

  private initMap() {
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    this.map.addControl(this.geolocateControl, "bottom-right");
    console.log(this.map);
    console.log(this);

    this.map.on('load', async () => {
      console.log(this);
      this.spinnerService.setLoading(false);

    });
    this.spinnerService.setLoading(false);

  }

  private startTracking() {
    navigator.geolocation.watchPosition(async (position) => {
      await this.tracker.track(position.coords.latitude.toString(), position.coords.longitude.toString(), this.route);
    });
  }

  private async showPosition(position: GeolocationPosition) {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
    console.log(this.tracker);
    // await this.home.tracker.track(position.coords.latitude.toString(), position.coords.longitude.toString(), "141");
  }

  private async initMarker(lng: any, lat: any, idAddress: any) {
    var index: number = this.addresses.indexOf(idAddress);
    if (index == -1) {
      index = this.addresses.length;
      this.addresses.push(idAddress);
    }

    this.map.addImage('pulsing-dot', this.pulsingDot, { pixelRatio: 2 });

    this.map.addSource('dot-point-' + index, {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [lat, lng] // icon position [lng, lat]
            }
          }
        ]
      }
    });
    this.map.addLayer({
      'id': 'layer-with-pulsing-dot-' + index,
      'type': 'symbol',
      'source': 'dot-point-' + index,
      'layout': {
        'icon-image': 'pulsing-dot'
      }
    });
    // new mapboxgl.Marker({ color: 'black', rotation: 45 })
    //   .setLngLat([lat, lng])
    //   .addTo(this.map);
  }

  private async initTracker() {
    this.tracker = new TrackerService(this.walletAuthService);
    this.tracker.initSubscription();

    console.log(this.tracker);
    // this.tracker.track("asd", "asdasd", "dsa");
    this.tracker.myEvent.subscribe((data) => {
      // Handle the emitted event here
      console.log("data on Component", data);
      // new mapboxgl.Marker()
      //   .setLngLat([data._x, data._y])
      //   .addTo(this.map);
      // this.map.removeLayer("layer-with-pulsing-dot");
      // this.map.removeSource("dot-point");
      this.initMarker(data._x, data._y, data.from);
    });
  }

  private pulsingDot: any = {
    width: 200,
    height: 200,
    data: new Uint8Array(200 * 200 * 4),

    // When the layer is added to the map,
    // get the rendering context for the map canvas.
    onAdd: function () {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext('2d');
    },

    // Call once before every frame where the icon will be used.
    render: function () {
      const duration = 1000;
      const t = (performance.now() % duration) / duration;

      const radius = (200 / 2) * 0.3;
      const outerRadius = (200 / 2) * 0.7 * t + radius;
      const context = this.context;

      // Draw the outer circle.
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        outerRadius,
        0,
        Math.PI * 2
      );
      context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
      context.fill();

      // Draw the inner circle.
      context.beginPath();
      context.arc(
        this.width / 2,
        this.height / 2,
        radius,
        0,
        Math.PI * 2
      );
      context.fillStyle = 'rgba(255, 100, 100, 1)';
      context.strokeStyle = 'white';
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();

      // Update this image's data with data from the canvas.
      this.data = context.getImageData(
        0,
        0,
        this.width,
        this.height
      ).data;

      // Continuously repaint the map, resulting
      // in the smooth animation of the dot.
      // this.map.triggerRepaint();

      // Return `true` to let the map know that the image was updated.
      return true;
    }
  };

  private plotRoute() {
    const data = this.coordinates.map((obj: any) => [obj.y, obj.x])
    console.log(data);
    this.map.addSource('route', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': data
        }
      }
    });
    this.map.addLayer({
      'id': 'route',
      'type': 'line',
      'source': 'route',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#888',
        'line-width': 8
      }
    });
  }

}

@Component({
  selector: 'app-map-selection',
  templateUrl: './map-selection.component.html',
  standalone: true,
  imports: [MatDialogModule],
})
export class MapSelectionComponent {
  constructor(
    public dialogRef: MatDialogRef<MapSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public action: string,
    private router: Router
  ) { }

  actionFunc = (action: string) => {
    this.dialogRef.close();
    this.router.navigate(['/bus-routes'], { queryParams: { action } });
  };

  onNoClick(): void {
    this.dialogRef.close();
  }
}