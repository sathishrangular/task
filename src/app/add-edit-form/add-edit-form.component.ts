import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,  } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-form',
  templateUrl: './add-edit-form.component.html',
  styleUrls: ['./add-edit-form.component.css']
})
export class AddEditFormComponent implements OnInit {

  clients: string[] = [
    'USA',
    'FRANCE',
    'INDIA',
  ];

  customerForm:FormGroup = new FormGroup({})

  constructor(
    private _fb:FormBuilder, 
    private _http:ApiService, 
    private _dialogRef: MatDialogRef<AddEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.loadForm()
    this.addEditFunction()
  }

  loadForm(){
    this.customerForm = this._fb.group({
      callType:['',Validators.required],
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      phoneNo:['',Validators.required],
      clients:['',Validators.required],
      others:['',Validators.required],
      notes:['',Validators.required],
      date:['',Validators.required]
    })
  }

  get f(): any { return this.customerForm.controls }

  submitForm(){
    
    if(this.customerForm.valid){

      let payload = this.customerForm.getRawValue()

      if(this.data){

        this._http.updateCustomerById(this.data.id,payload).subscribe({
          next: (val:any) => {
            confirm('if you want to update this customer record ?')
            this._dialogRef.close(true)
          },
          error: (err:any) => {
            console.log("some this went worng",err);
          }
        })

      } else {

        this._http.postCustomer(payload).subscribe({
          next: (val:any) => {
            alert("Customer Record Added Successfully")
            this._dialogRef.close(true)
          },
          error: (err:any) => {
            console.log("some this went worng",err);
          }
        })

      }
    }
  }

  addEditFunction(){
    this.customerForm.patchValue(this.data)
  }

}
