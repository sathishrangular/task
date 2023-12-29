import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiurl = 'http://localhost:3000/customersList'

  constructor(private _Http:HttpClient) { }

  postCustomer(data:any): Observable<any>{
    return this._Http.post(this.apiurl,data)
  }

  getCustomer(): Observable<any>{
    return this._Http.get(this.apiurl)
  }

  deleteCustomerById(id:any): Observable<any>{
    return this._Http.delete(this.apiurl+'/'+id)
  }

  updateCustomerById(id:number,data:any): Observable<any>{
    return this._Http.put(this.apiurl+'/'+id,data)
  }
}
