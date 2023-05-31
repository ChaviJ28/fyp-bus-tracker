import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { TrackerService } from '../../services/blockchain/tracker.service';
import { WalletAuthService } from '../../services/wallet-auth.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})

export class MapViewComponent implements OnInit {
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

  constructor(private spinnerService: SpinnerService, private walletAuthService: WalletAuthService) { }

  async ngOnInit() {
    this.spinnerService.setLoading(true);
    mapboxgl!.accessToken = "pk.eyJ1IjoiY2hhdmktY29kZXZpZ29yIiwiYSI6ImNsaGIzdmVjNDBub3AzZXMybjViM3VqNWYifQ._FuHAP8YwUCJd2uCp_Qnaw";
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 9,
      center: [57.5865, -20.2367]
    });
    this.initTracker();


    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    this.map.addControl(this.geolocateControl, "bottom-right");
    console.log(this.map);
    console.log(this);

    this.map.on('load', async () => {
      console.log(this);
      this.spinnerService.setLoading(false);

      navigator.geolocation.watchPosition(async (position) => {
        await this.tracker.track(position.coords.latitude.toString(), position.coords.longitude.toString(), "141");

      });
    });

  }

  private async showPosition(position: GeolocationPosition) {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
    console.log(this.tracker);
    // await this.home.tracker.track(position.coords.latitude.toString(), position.coords.longitude.toString(), "141");
  }

  private async initMarker(lng: any, lat: any) {
    this.map.addImage('pulsing-dot', this.pulsingDot, { pixelRatio: 2 });

    this.map.addSource('dot-point', {
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
      'id': 'layer-with-pulsing-dot',
      'type': 'symbol',
      'source': 'dot-point',
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
      this.initMarker(data._x, data._y);
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
      this.map.triggerRepaint();

      // Return `true` to let the map know that the image was updated.
      return true;
    }
  };


}