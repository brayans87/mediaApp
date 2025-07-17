import { Component, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/patient';
import { MatTableDataSource} from '@angular/material/table';
import { MaterialModule } from '../../material/material.module';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';


@Component({
  selector: 'app-patient',  
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent {

  dataSource: MatTableDataSource<Patient>;
  //displayedColumns: string[] = ['idPatient', 'firstName', 'lastName', 'dni'];
  columnsDefinitions = [
    { def: 'idPatient', label: 'idPatient', hide: true },
    { def: 'firstName', label: 'firstName', hide: false },
    { def: 'lastName', label: 'idPatient', hide: false },
    { def: 'dni', label: 'dni', hide: false },
    { def: 'actions', label: 'actions', hide: false }
  ];

  totalElements: number = 0;
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private patientService: PatientService,
    private _snackBar: MatSnackBar
  ){}

  ngOnInit(): void {    
    this.patientService.listPageable(0, 2).subscribe(data => {
      this.createTable(data.content);
      this.totalElements = data.totalElements;
    })
    //this.patientService.findAll().subscribe(data => this.createTable(data));

    this.patientService.getPatientChange().subscribe(data => this.createTable(data));
    this.patientService.getMessageChange().subscribe(message => this._snackBar.open(message, 'INFO', { duration: 2000 }));
    
  }

  createTable(data: Patient[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value;
    /*this.dataSource.filterPredicate = function (record,filter) {
      return record.addresses.some(address => address.street === filter);
    }*/
  }

  getDisplayedColumns(){
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  delete(id: number){
    this.patientService.delete(id).pipe(
      switchMap( () => this.patientService.findAll() ),
      tap( data => this.patientService.setPatientChange(data)),
      tap( () => this.patientService.setMessageChange('DELETED!'))
    ).subscribe();
  }

  showMore(e: any){
    this.patientService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.createTable(data.content);
      this.totalElements = data.totalElements;
    });
  }
}
