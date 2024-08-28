import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { DashboardService } from './dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { UpdateMedComponent } from './update-med/update-med/update-med.component';
import { CommonModule } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [provideNativeDateAdapter(),

  { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
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
    MatExpansionModule,
    MatDialogActions,
    CommonModule,
    MatAutocompleteModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})


export class DashboardComponent {
  showAutocomplete: boolean = true;
  myControl = new FormControl('');
  // options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<Medicines[]> | undefined;

  medicines: Medicines[] = [];

  readonly dialog = inject(MatDialog);
  readonly panelOpenState = signal(false);
  isButtonEnabled: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['position', 'name', 'description', 'stock', 'active', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Medicines>();

  readonly campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });
  readonly campaignTwo = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });
  readonly campaignExpiry = new FormGroup({
    expiry: new FormControl(new Date()),
  });

  readonly campaignType = new FormGroup({
    type: new FormControl(),
  });

  readonly medicineForm = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    stock: new FormControl(),

  });

  constructor(private dashboardService: DashboardService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.Fetchall();

  }

  private _filter(value: string): Medicines[] {

    const filterValue = value.toLowerCase();
    const filteredMedicines = this.medicines.filter(medicine =>
      medicine.type.toLowerCase().includes(filterValue)
    );

    const uniqueMedicinesMap = new Map<string, Medicines>();
    filteredMedicines.forEach(medicine => {
      if (!uniqueMedicinesMap.has(medicine.type)) {
        uniqueMedicinesMap.set(medicine.type, medicine);
      }
    });
    const uniqueMedicines = Array.from(uniqueMedicinesMap.values());
    console.log(uniqueMedicines);
    return uniqueMedicines;
  }

  // Fetchall() {
  //   this.dashboardService.getAllMed().subscribe((medicines) => {
  //     this.medicines = medicines; 
  //     this.dataSource.data = this.medicines; 
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     console.log(this.medicines);
  //   });
  // }

  Fetchall() {
    this.dashboardService.getAllMed().subscribe((medicines) => {
      this.medicines = medicines;
      this.dataSource.data = this.medicines;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });
  }

  // openSnackBar() {
  //   this._snackBar.open("Saved");
  // }
  // openDialog(medicine: any) {
  //   this.dialog.open(UpdateMedComponent, {
  //     data: medicine
  //   });
  // }

  openDialog(medicine: any): void {
    const dialogRef = this.dialog.open(UpdateMedComponent, {
      data: medicine
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.Fetchall();
      }
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
    this.dashboardService.isActiveUpdateStatus(element.med_id, element.is_active).subscribe(response => {
      console.log('After toggle:', element.is_active);
    }, error => {
      console.error('Error updating status', error);
    });
  }

  onCheckChange(element: any) {
    console.log(element.med_id)
    this.isButtonEnabled = !!element.med_id;
  }

  deleteItem(element: any) {
    if (element && element.med_id !== undefined) {
      console.log('Element:', element);
      console.log(element.med_id);
      this.dashboardService.deleteMedicine(element.med_id).subscribe({
        next: (response) => {
          console.log(response);
          this._snackBar.open("Deleted successfully");
          this.Fetchall();
          this.medicineForm.reset();
        },
        error: (err) => {
          console.error('Error deleting medicine:', err);
        }
      });
    } else {
      console.error('Element is undefined');
    }
  }

  onSubmitDate(): void {
    let formValue = this.campaignOne.value;

    let startDate = formValue.start instanceof Date ? formValue.start : null;
    let endDate = formValue.end instanceof Date ? formValue.end : null;

    let formattedStartDate = startDate ? this.formatDate(startDate) : '';
    let formattedEndDate = endDate ? this.formatDate(endDate) : '';

    console.log(formattedStartDate);
    console.log(formattedEndDate);
    this.dashboardService.getByRange(formattedStartDate, formattedEndDate).subscribe(
      (dataByDateRange: any) => {
        this.dataSource.data = dataByDateRange;
      },
      (error: any) => {
        console.error('Error fetching medicines', error);
      }
    );
  }


  getByExpiry(): void {
    let formValue = this.campaignExpiry.value;
    let expirydate = formValue.expiry instanceof Date ? formValue.expiry : null;
    let formattedStartDate = expirydate ? this.formatDate(expirydate) : '';
    console.log(formattedStartDate);
    this.dashboardService.getByExpiryDate(formattedStartDate).subscribe(
      (dataByDateRange: any) => {
        this.dataSource.data = dataByDateRange;
      },
      (error: any) => {
        console.error('Error fetching medicines', error);
      }
    );
  }

  getByType(event: MatAutocompleteSelectedEvent): void {
    const typevalue = event.option.value;
    this.dashboardService.getByType(typevalue).subscribe(
      (response: any) => {
        this.dataSource.data = response;
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );

    console.log(this.campaignType.value);
  }

  clearAndFetchAll(): void {
    // this.showAutocomplete = false;
    this.myControl.reset();
    this.campaignType.controls['type'].reset();
    this.Fetchall(); 
  }


  addMed() {
    if (this.medicineForm.valid) {
      const newMedicines: any = this.medicineForm.value;
      this.dashboardService.AddnewMed(newMedicines).subscribe({
        next: (response) => {
          console.log(response);
          this._snackBar.open("       Saved");

          this.Fetchall();
          this.medicineForm.reset();
        },
        error: (err) => {
          console.error('Error adding medicine:', err);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  // updateMed() {
  //   console.log("test")
  // }

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







