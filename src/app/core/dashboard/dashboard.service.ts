import { Injectable } from '@angular/core';
import { EndpointsService } from '../../shared/endpoints.service';
import { HttpClient } from '@angular/common/http';
import { Medicines } from '../../interfaces/medicines.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private http: HttpClient,
    private endpoints: EndpointsService) { }



    getAllMed(): Observable<Medicines[]> {
      // console.log(this.endpoints.FetchallMedicines)
      // console.log( this.http.get(this.endpoints.FetchallMedicines))
      return this.http.get<Medicines[]>(this.endpoints.FetchallMedicines);
      
    }

    isActiveUpdateStatus(med_id: number, is_active: boolean): Observable<any> {
      console.log("service:" + is_active);
      console.log("service:" + med_id);
      return this.http.put<any>(`${this.endpoints.isActiveUpdate}${med_id}?is_active=${is_active}`, {});
    }
    
    

    getByRange(startDate: string , endDate: string):Observable<any> {
      let url = `${this.endpoints.getByRange}startDate=${startDate}&endDate=${endDate}`;

      // console.log("HERE " + url +" HERE")
      return this.http.get<any>(url);

    }
}
