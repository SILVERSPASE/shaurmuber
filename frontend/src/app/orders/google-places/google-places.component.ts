import {Component, ElementRef, NgZone, OnInit, ViewChild, Input, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';


@Component({
  selector: 'google-places',
    styles: [`
    agm-map {
      height: 400px;
    }
  `],
  template: `
        <div>
      <div class="form-group">
        <input placeholder="search for location" 
               autocorrect="off" 
               autocapitalize="off" 
               spellcheck="off" 
               type="text" 
               class="form-control" 
               #search 
               [formControl]="searchControl">
      </div>
      <agm-map [latitude]="latitude" [longitude]="longitude" [scrollwheel]="false" [zoom]="zoom">
        <agm-marker 
          [latitude]="latitude" 
          [longitude]="longitude"
          [markerDraggable]="true"
          (dragEnd)="markerDragEnd($event)" 
        ></agm-marker>
      </agm-map>
    </div>
`
})


export class GooglePlacesComponent implements OnInit {

  @Input() latitude: number;
  @Input() longitude: number;
  @Output() changeCoordinates = new EventEmitter<{'lat': number, 'lng': number}>();

  public searchControl: FormControl;
  public zoom: number = 12;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {
  }



  ngOnInit() {
    //set google maps defaults


    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.changeCoordinates.emit({
            'lat': this.latitude,
            'lng': this.longitude
            });
          this.zoom = 12;
        });
      });
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  private markerDragEnd($event: MouseEvent) {
    this.changeCoordinates.emit({
      'lat': $event['coords']['lat'],
      'lng': $event['coords']['lng']
      });
    this.searchElementRef.nativeElement.value = '';
  }

}
