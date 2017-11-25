import {Component, Input, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import {Order} from '../order.model';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {PlacesService} from '../../profile/places/places-service';
import {Place} from '../../profile/places/place';
import {MapsAPILoader} from '@agm/core';
import {} from 'googlemaps';

import {OrdersService} from '../order.service';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.less'],
  providers: [
    DatePipe,
    PlacesService,
  ],
})
export class OrderCreateComponent implements OnInit {
  createOrderForm: FormGroup;
  order: Order = new Order();
  newOrder: Order = new Order();
  @Input() formOrderUpdate: boolean;
  public form: FormGroup;
  orderId: any;
  sub;
  current_user: any;
  newAddedOrder: Order[] = [];

  coordinate_from_value: boolean;
  coordinate_to_value: boolean;

  userFromPlaces: Place[];
  userToPlaces: Place[];
  // search places attributes for displaying select element
  userSelectFrom = false;
  userSelectTo = false;
  // input fields for autocomplete in creating order
  public searchFromControl: FormControl;
  public searchToControl: FormControl;
  @ViewChild('searchFrom')
  public searchElementRef: ElementRef;
  @ViewChild('searchTo')
  public searchElementRefTo: ElementRef;

  closeResult: string;

  numberRegex = /^\d+$/;


  formErrors = {
    'title': '',
    'price': '',
    'delivery': '',
    'detail': '',
    'timefrom': '',
    'timeto': '',
  };
  validationMessages = {
    'title': {
      'required': 'Title is required!',
    },
    'price': {
      'required': 'Price is required!',
      'pattern': 'You can use only numbers',
    },
    'delivery': {
      'required': 'Delivery is required!',
      'pattern': 'You can use only numbers',
    },
    'detail': {
      'required': 'Detail is required!',
    },
    'timefrom': {
      'required': 'Time from is required!',
    },
    'timeto': {
      'required': 'Time to is required!',
    },
  };

  constructor(
    private fb: FormBuilder,
    private service: OrdersService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private placesService: PlacesService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.current_user = JSON.parse(localStorage.getItem('currentUser'));
    this.getUserPlaces();
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      this.orderId = params;
    });
    this.searchFromControl = new FormControl();
    this.searchToControl = new FormControl();
    this.order.from_time = this.datePipe.transform(new Date(), 'MMMM dd, yyyy hh:mm a');
    this.order.to_time = this.datePipe.transform(new Date(), 'MMMM dd, yyyy hh:mm a');

    if (this.formOrderUpdate) {
      this.orderService.getOneOrder(this.orderId.orderId).subscribe(
        order => {

          this.order = order;
          this.newAddedOrder.push(this.order);
          this.order.customer = this.current_user.uuid;
          this.order.from_time = this.datePipe.transform(new Date(), 'MMMM dd, yyyy hh:mm a');
          this.order.to_time = this.datePipe.transform(new Date(), 'MMMM dd, yyyy hh:mm a');
          delete this.order.uuid;
        },
        err => {
          console.log(err);
        });

    }
    this.buildAccountForm();
    if (this.order.cordinate_from = 'undefined') {
      this.coordinate_from_value = false;
      this.coordinate_to_value = false;
    }
    this.searchFromInput();
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private buildAccountForm() {
    this.createOrderForm = this.fb.group({
      'timefrom': ['', [
      Validators.required,
      ]],
      'timeto': ['', [
      Validators.required
      ]],
      'price': ['', [
      Validators.required,
      Validators.pattern(this.numberRegex),
      ]],
      'delivery': ['', [
      Validators.pattern(this.numberRegex),
      ]],
      'detail': ['', [
      Validators.required,
      ]],
      'title': ['', [
      Validators.required,
      ]],
    });
  }

  getFromChild(order) {
    this.newOrder = order;
    this.newAddedOrder.push(this.newOrder);
    this.order.cordinate_from = this.newOrder.cordinate_from;
    this.order.cordinate_to = this.newOrder.cordinate_to;
    if (this.order.cordinate_from != 'undefined') {
      this.coordinate_from_value = true;
      this.coordinate_to_value = true;
    }
  }

  addStatusPublic() {
    this.order.status = 'public';
  }

  addStatusDraft() {
    this.order.status = 'draft';
  }

  editStatusPublic() {
    this.order.status = 'public';
    if (this.formOrderUpdate) {
      this.order.to_time = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss.000'Z'");
      this.order.from_time = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss.000'Z'");
      this.orderService.updateOrder(this.orderId.orderId, this.order);
      this.router.navigate(['/orders']);
    }
  }

  editStatusDraft() {
    this.order.status = 'draft';
    if (this.formOrderUpdate) {
      this.order.to_time = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss.000'Z'");
      this.order.from_time = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss.000'Z'");
      this.orderService.updateOrder(this.orderId.orderId, this.order)
      this.router.navigate(['/orders']);

    }
  }

  turnDownPrice() {
    if (typeof (this.order.order_price) == 'undefined') {
      this.order.order_price = 0;
    }
    if (+this.order.order_price != 0) {
      this.order.order_price -= 1;
    }
  }

  turnUpPrice() {
    if (typeof (this.order.order_price) == 'undefined') {
      this.order.order_price = 0;
    }
    if (typeof (this.order.order_price) == 'string') {
      this.order.order_price = +this.order.order_price;
    }
    this.order.order_price += 1;
  }

  turnDownDelivery() {
    if (typeof (this.order.delivery_price) == 'undefined') {
      this.order.delivery_price = 0;
    }
    if (+this.order.delivery_price != 0) {
      this.order.delivery_price -= 1;
    }
  }

  turnUpDelivery() {
    if (typeof (this.order.delivery_price) == 'undefined') {
      this.order.delivery_price = 0;
    }
    if (typeof (this.order.delivery_price) == 'string') {
      this.order.delivery_price = +this.order.delivery_price;
    }
    this.order.delivery_price += 1;
  }

  registerOrder() {
    this.order.title = this.createOrderForm.value.title;
    this.order.delivery_price = this.createOrderForm.value.delivery;
    this.order.order_price = this.createOrderForm.value.price;
    this.order.description = this.createOrderForm.value.detail;
    this.order.from_time = this.createOrderForm.value.timefrom;
    this.order.to_time = this.createOrderForm.value.timeto;
    this.order.customer = this.current_user.uuid;
    this.order.distance = this.newOrder.distance;
    this.service.createOrder(this.order);
  }

  onValueChange(data?: any) {
    if (!this.createOrderForm) {
      return;
    }
    const form = this.createOrderForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  showInfoDiv() {
    // used to get information div for coordinates in creating order
    document.getElementById('info-map').classList.toggle('display-block');
  }


  getUserPlaces() {
    // retrieve from database user`s predefined places for order
    this.placesService.getUserPlaces(this.current_user['uuid'])
      .then(response => {
        this.userFromPlaces = response.filter(
          place => place.type === 'From');
        if (this.userFromPlaces.length !== 0) {
          this.userSelectFrom = true;
        }
        this.userToPlaces = response.filter(
          place => place.type === 'To');
        if (this.userToPlaces.length !== 0) {
          this.userSelectTo = true;
        }
      });
  }
  onChangeCoordinates(event) {
    // this method used in select elements for common places
    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id;
    let id = idAttr.nodeValue;
    if (id === 'coordinate_from') {
      this.coordinate_from_value = true;
      this.newAddedOrder.push(this.order);
      this.newOrder = this.order;
      this.searchElementRef.nativeElement.value = '';
    } else if (id === 'coordinate_to') {
      this.coordinate_to_value = true;
      this.newOrder = this.order;
      this.newAddedOrder.push(this.newOrder);
      this.searchElementRefTo.nativeElement.value = '';
    }
  }


  searchFromInput() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });

      let autocompleteTo = new google.maps.places.Autocomplete(this.searchElementRefTo.nativeElement, {
        types: ['address']
      });
      // adds event listener on input field 'From' for coordinates
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          let newCoord = {
            'lat': place.geometry.location.lat(),
            'lng': place.geometry.location.lng()
          };
          //set latitude, longitude and zoom
          this.order.cordinate_from = newCoord;
          this.newOrder = this.order;
          this.coordinate_from_value = true;
          this.newAddedOrder.push(this.order);
        });
      });
      // adds event listener on input field 'TO' for coordinates
      autocompleteTo.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocompleteTo.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          let newCoord = {
            'lat': place.geometry.location.lat(),
            'lng': place.geometry.location.lng()
          };
          //set latitude, longitude and zoom
          this.order.cordinate_to = newCoord;
          this.coordinate_to_value = true;
          this.newOrder = this.order;
          this.newAddedOrder.push(this.newOrder);
        });
      });
    });
  }
}

