import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Location} from '@angular/common';


import {OtcService} from './otc.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-otc',
  templateUrl: './otc.component.html',
  styleUrls: ['./otc.component.css'],
  providers: [OtcService]
})

export class OtcComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private otcService: OtcService,
              private location: Location,
              ) { }

  otcType: string;
  uuid: string;

  ngOnInit(): void {
    let uuid = this.route.snapshot.paramMap.get('uuid');
    this.otcService.sendOTC(uuid);
  }


}
