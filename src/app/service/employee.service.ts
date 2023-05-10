import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
  providedIn:'root'
})

export class EmployeeService{
  constructor(private _http:HttpClient){}
  getAllEmployees(): Observable<any>{
    return this._http.get<any>('http://localhost:8080/afya/viewEmployee')
}


  addEmployee(data:any): Observable<any>{
    return this._http.post<any>('http://localhost:8080/afya/addEmployee',data);
  }

  removeEmployee(id:number):Observable<any>{
    return this._http.delete<any>('http://localhost:8080/afya/removeEmployee/'+id);
  }
}
