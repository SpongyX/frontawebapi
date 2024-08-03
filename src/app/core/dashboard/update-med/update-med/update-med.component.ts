import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from '../../dashboard.service';
import { BrowserModule } from '@angular/platform-browser';
import { Medicines } from '../../../../interfaces/medicines.interface';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-update-med',
  standalone: true,
  imports: [

    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, 
    MatButtonModule,FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule
  ],
   changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './update-med.component.html',
  styleUrl: './update-med.component.css'
})
export class UpdateMedComponent {
  medicines: Medicines[] = [];
  readonly medicineUpdateForm: FormGroup;

  constructor(private dashboardService: DashboardService,
    public dialogRef: MatDialogRef<UpdateMedComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.medicineUpdateForm = new FormGroup({
      med_id: new FormControl(data.med_id),
      name: new FormControl(data.name),
      description: new FormControl(data.description),
      stock: new FormControl(data.stock),
    });
}
ngOnInit(): void {
  this.Fetchall();
   }
   
Fetchall() {
  this.dashboardService.getAllMed().subscribe((medicines) => {
    this.medicines = medicines; 
  });
}

  updateMed() {
    console.log(this.medicineUpdateForm.value)
    // console.log(this.data.value)
    
    if (this.medicineUpdateForm.valid) {
      const newMedicines: any = this.medicineUpdateForm.value;
      const medId = this.data.med_id;
      console.log(medId);
      this.dashboardService.updateMedicine(newMedicines).subscribe({
        next: (response) => {
          console.log("new", medId);
          this._snackBar.open("       Updated");
          this.dialogRef.close('saved');
          this.medicineUpdateForm.reset();
        },
        error: (err) => {
          console.error('Error adding medicine:', err);
        }
      });
    } else {
      console.log('Form is invalid');
    }



    }



}
