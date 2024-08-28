import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {

  constructor() { }

  private baseUrl = environment.apiUrl;
  
  // Medicines Endpoint
  public FetchallMedicines: string = this.baseUrl + 'Medicines/GetMedicines/';
  public isActiveUpdate: string = this.baseUrl + 'Medicines/isActiveUpdate/';
  public getByRange: string = this.baseUrl + 'Medicines/GetByDateRange?';
  public addNewMedicine: string = this.baseUrl + 'Medicines/AddNewMedicine/';
  public updateMedicine: string = this.baseUrl + 'Medicines/UpdateMed/';
  public deleteMedicine: string = this.baseUrl + 'Medicines/DeleteMed?';
  public getByExpiryDate: string = this.baseUrl + 'Medicines/GetbyExpiryDate?';
  public getByType: string = this.baseUrl + 'Medicines/GetbyType?';

}
