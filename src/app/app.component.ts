import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditFormComponent } from './add-edit-form/add-edit-form.component';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ApiService } from './services/api.service';

import 'jspdf-autotable';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'customer-call-application';

  displayedColumns: string[] = ['id', 'callType', 'firstName', 'lastName','phoneNo', 'clients', 'others', 'notes', 'date', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  constructor(private _dialog: MatDialog, private _Http:ApiService){
  }
  
  ngOnInit(): void {
    this.getAllCustomersList()
  }

  openAddEditForm(){
    let dialogRef = this._dialog.open(AddEditFormComponent)
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if(val){
          this.getAllCustomersList()
        }
      }
    })
  }

  exportToPdf() {
    const doc = new jsPDF();
    
    // Add table headers
    const headers = this.displayedColumns;
    const data = this.dataSource.data.map(row =>
      headers.map(column => row[column])
    );
    
    autoTable(doc, {
      head: [headers],
      body: data,
    });
    
    // Save the PDF file
    doc.save('customer_call_details.pdf');
  }
  
  

  getAllCustomersList(){
    this._Http.getCustomer().subscribe({
      next: (val) => {
        this.dataSource = new MatTableDataSource(val);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  deleteCustomer(id:any){
    let conf = confirm('if you want to delete this customer ?')
    if(conf){

      this._Http.deleteCustomerById(id).subscribe({
        next: (val) => {
          this.getAllCustomersList()
        },
        error: (err) => {
          console.log(err)
        }
      })

    }else{
      console.log("no thanks")
    }
  }

  updateCustomer(data:any){
    let dialogRef = this._dialog.open(AddEditFormComponent,{
      data,
    })
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if(val){
          this.getAllCustomersList()
        }
      }
    })
  }



}
