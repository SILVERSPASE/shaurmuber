import {GoogleMapsAPIWrapper}  from '@agm/core';
import { Directive,  Input, Output } from '@angular/core';
import {Order} from '../order.model';

declare var google: any;



@Directive({
  selector: 'agm-map-directions'
})
export class DirectionsMapDirective {

  origin:any ;
  destination:any;
  order: any;
  directionsDisplay: any;
  directionsService: any;

  constructor (private gmapsApi: GoogleMapsAPIWrapper) {}

  showDirections(){
    this.gmapsApi.getNativeMap().then(map => {
      this.directionsDisplay.setOptions({
          preserveViewport: true
        });
      this.directionsService.route({
        origin: {lat: this.origin.latitude, lng: this.origin.longitude},
        destination: {lat: this.destination.latitude, lng: this.destination.longitude},
        provideRouteAlternatives: true,
        travelMode: 'WALKING'
      }, (response, status) => {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(response);
          this.directionsDisplay.setMap(map);
          this.order.distance = response.routes[0].legs[0].distance.value;
          console.log('Distance ' + this.order.distance);
          // console.log('Time ' + response.routes[0].legs[0].duration.text);
        } else {
          console.log('Directions request failed due to ' + status);
        }
      });

    });
  }


  ngOnInit(){
    this.gmapsApi.getNativeMap().then(map => {
      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;
    });
  }

}
