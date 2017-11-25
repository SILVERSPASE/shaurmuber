import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class OtcService {

    constructor(private http: HttpClient) {};

    sendOTC(otc: string): Promise<any>{
        var url = "/api/otc/";
        return this.http.put(url, {'uuid': otc})
        		.toPromise()
        		.then(response => {
        			if(response['otc_type'] == 'user_registration'){
        				location.href = '/login/';
        			}
        			if(response['otc_type'] == 'email_changing'){
        				location.href = '/profile/';
        			}
        		});
    }

};
