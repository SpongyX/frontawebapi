import { Component, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Medicines } from '../../interfaces/medicines.interface';
import { HomeService } from '../../mainpage/dashboard/home.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [provideNativeDateAdapter(),

    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  imports: [

    MatPaginatorModule, 
    MatTableModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  readonly panelOpenState = signal(false);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['checkbox','position', 'name',  'description', 'stock', 'active'];
  dataSource = new MatTableDataSource<Medicines>();
 
  readonly campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });
  readonly campaignTwo = new FormGroup({
    start: new FormControl(new Date() ),
    end: new FormControl(new Date() ),
  });

  medicines: Medicines[] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getAllMed().subscribe((medicines) => {
      this.medicines = medicines; 
      this.dataSource.data = this.medicines; 
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.medicines);
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onToggleChange(element: any): void {
  
    this.homeService.isActiveUpdateStatus(element.med_id, element.is_active).subscribe(response => {
      console.log('After toggle:', element.is_active);
    }, error => {
      console.error('Error updating status', error);
    });
  }
  
  

  onCheckChange(element: any): void {
  console.log(element.med_id)

  }

  

  onSubmitDate(): void {
    let formValue = this.campaignOne.value;
    
    // Convert start and end to Date objects if they are valid
    let startDate = formValue.start instanceof Date ? formValue.start : null;
    let endDate = formValue.end instanceof Date ? formValue.end : null;
  
    // Convert dates to strings, or handle null cases
    let formattedStartDate = startDate ? this.formatDate(startDate) : '';
    let formattedEndDate = endDate ? this.formatDate(endDate) : '';
  
    // Log the formatted dates
    console.log(formattedStartDate);
    console.log(formattedEndDate);
  
    // Call the service method with formatted dates
    this.homeService.getByRange(formattedStartDate, formattedEndDate).subscribe(
      (dataByDateRange: any) => {
        this.dataSource.data = dataByDateRange;
      },
      (error: any) => {
        console.error('Error fetching medicines', error);
      }
    );
  }
  
  

  /////////////////////////////////////////////////////////////////////////////////////////////
  // Helper function to format a Date object with time set to 00:00:00.000
   formatDate(date: Date): string {
    // Reset time to 00:00:00.000
    date.setHours(0, 0, 0, 0);
  
    // Extract components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  
    // Format timezone offset
    const offset = date.getTimezoneOffset();
    const sign = offset > 0 ? '-' : '+';
    const absOffset = Math.abs(offset);
    const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
    const offsetMinutes = String(absOffset % 60).padStart(2, '0');
    const formattedOffset = `${sign}${offsetHours}${offsetMinutes}`;
  
    // Construct formatted date string
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} ${formattedOffset}`;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////

}
