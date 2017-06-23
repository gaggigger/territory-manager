import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { Household } from './household';
import { Codcard } from './codcard';
import 'rxjs/Rx';

const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');
contentHeaders.append('x-access-token',localStorage.getItem('token'));
let options = new RequestOptions( {method: 'GET', headers: contentHeaders });
const API_URL: string = "https://modern-territory-evandocarmo.c9users.io/api/";

@Injectable()
export class HouseholdService {

  constructor(private router: Router, private http: Http) { }

  public getHouseholdsByUser(user){
    let params:URLSearchParams = new URLSearchParams();
    params.set('user',user);
    options.params = params;
    return this.http.get(API_URL + "households",options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  public getHouseholdsBycardCod(cardCod){
    let params:URLSearchParams = new URLSearchParams();
        for(var cod in cardCod){
          console.log(cardCod[cod]);
          params.append('cod_card_cod',cardCod[cod]);
        }
    options.params = params;
    console.log(params);
    return this.http.get(API_URL + "households",options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getHouseholdsByQuantity(quantity,neighborhood){
    let params:URLSearchParams = new URLSearchParams();
    params.set("quantity",quantity);
    params.set("area_name",neighborhood);
    options.params = params;
    return this.http.get(API_URL + "households",options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getHouseholdsByCods(cods){
    let params:URLSearchParams = new URLSearchParams();
        for(var cod in cods){
          console.log(cods[cod]);
          params.append('cod',cods[cod]);
        }
    options.params = params;
    return this.http.get(API_URL + "households",options)
      .map(this.extractData)
      .catch(this.handleError)
  }

  public checkoutHouseholds(cod,user):Observable<any>{
    let putOptions = new RequestOptions( {method: 'PUT', headers: contentHeaders });
    return this.http.put(API_URL + "households/checkout",JSON.stringify({cod,user}),putOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }
  public returnedHouseholds(cod,user):Observable<any>{
    let putOptions = new RequestOptions( {method: 'PUT', headers: contentHeaders });
    return this.http.put(API_URL + "households/return",JSON.stringify({cod,user}),putOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }
  public updateHousehold(household):Observable<any>{
    let putOptions = new RequestOptions( {method:'PUT', headers:contentHeaders});
    return this.http.put(API_URL+"households",JSON.stringify(household),putOptions)
      .map(this.extractData)
      .catch(this.handleError)
  }
  public deleteHousehold(cod):Observable<any>{
    let deleteOptions = new RequestOptions( {method:'DELETE',headers:contentHeaders} );
    let params:URLSearchParams = new URLSearchParams();
    params.set("cod",cod);
    deleteOptions.params = params;
    return this.http.delete(API_URL + "households",deleteOptions)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log(body);
    (JSON.stringify(body));
    return body || { };
  }
  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }

}