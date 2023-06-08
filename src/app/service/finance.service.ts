import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Finance } from "../model/finance";

@Injectable({
  providedIn:'root'
})

export class FinanceService
{
  constructor(private _http:HttpClient){}

  getAllFinance(): Observable<any>{
    return this._http.get<any>('http://localhost:8080/afya/viewFinance')
  }
  saveFinance(finance:Finance): Observable<any>{
    return this._http.put<any>('http://localhost:8080/afya/editFinance/'+finance.financeId,finance)
  }
  getStatistics(): Observable<any>{
    return this._http.get<any>('http://localhost:8080/afya/viewStats')
  }
  getYears(): Observable<any>{
    return this._http.get<any>('http://localhost:8080/afya/yearsFound')
  }
  getFilteredStats(date:string[]): Observable<any>{
    return this._http.post<any>('http://localhost:8080/afya/viewFilteredStats',date)
  }
}
