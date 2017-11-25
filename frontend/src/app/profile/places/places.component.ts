import { Component, OnInit} from '@angular/core';

import { PlacesService } from "./places-service";
import { Place, CreatePlace } from "./place";
import { CurrentUserService } from "../../authentication/current-user.service";
import { User} from '../user-profile.model'


@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.less'],
  providers: [
    PlacesService,
    CurrentUserService,
  ],
})
export class PlacesComponent implements OnInit {
  places: Place[];
  private lat: number;
  private lng: number;
  private user: User;
  private showForm: boolean;
  private type = ["From", "To"];
  private model: any;
  private userData: any;
  private selectedPlace: Place;
  constructor(private placesService: PlacesService,) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("currentUser"));
    this.user = new User(this.userData);
    this.model = new CreatePlace(this.type[0], this.user['id'], '', {'lat': this.lat, 'lng': this.lng});
    this.showForm = false;
    this.lat = +this.userData.lat;
    this.lng = +this.userData.lng;
    this.getPlaces();
  }

  changeCoordinates(coord): void {
      this.lat = coord['lat'];
      this.lng = coord['lng'];
  };

  onSelect(place: Place) {
    this.lat = place.coordinates['lat'];
    this.lng = place.coordinates['lng'];
    this.selectedPlace = place;
    this.model = this.selectedPlace;
  }

  createForm() {
    this.model = new CreatePlace(this.type[0], this.user['id'], '',
    {'lat': this.lat, 'lng': this.lng});
    this.showForm = true;
  }

  hideForm() {
    this.showForm = false;
    this.model = new CreatePlace(this.type[0], this.user['id'], '',
    {'lat': this.lat, 'lng': this.lng});
  }

  getPlaces() {
    this.placesService
      .getUserPlaces(this.userData['uuid'])
      .then(places => {
      this.places = places;
    });
  }

  createPlace() {
    if (this.model['id']) {
      this.model.coordinates = {'lng': this.lng, "lat": this.lat};
      this.placesService.patchPlace(this.user['uuid'], this.model)
        .then(res => {
        this.getPlaces();
      });
    } else {
      this.placesService.createPlace(
        this.user['uuid'],
        this.model.type,
        this.user['id'],
        this.model.title,
        {'lng': this.lng, 'lat': this.lat}
      ).then(res => {
        this.getPlaces();
      });
    }
    this.showForm=false;
  }

  deletePlace(event:any, place:any) {
    this.placesService.delPlace(this.user['uuid'], place)
      .then(res => {this.getPlaces()})
  }

  goToChangeForm(event, place) {
    this.model = place;
    this.showForm = true;
  }
}
