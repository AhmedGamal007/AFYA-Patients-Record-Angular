import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseViewModel } from '../model/responseviewmodel';
import { Observable } from 'rxjs';


@Injectable({
  providedIn:'root'
})

export class ProductService{

  constructor(private _http:HttpClient){}

    getAllPatients(): Observable<any>{
        return this._http.get<any>('http://localhost:8080/afya/viewPatients')
    }

    uploadImage(formdata: FormData): Observable<any>{
      return this._http.post<any>('http://localhost:8080/afya/upload',formdata);
    }

    addPatient(data:any): Observable<any>{
      return this._http.post<any>('http://localhost:8080/afya/addPatient',data);
    }

    deletePatient(id:number): Observable<any>{
      return this._http.delete<any>('http://localhost:8080/afya/deletePatient/'+id);
    }
    getPatient(id:number) : Observable<any>{
      return this._http.get<any>('http://localhost:8080/afya/getPatient/'+id);
    }
    editPatient(id:number,data:any): Observable<any>{
      return this._http.put<any>('http://localhost:8080/afya/editPatient/'+id,data);
    }
}
