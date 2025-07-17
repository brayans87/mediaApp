import { Component, inject, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatTabGroup, MatTabsModule} from '@angular/material/tabs';
import { format } from 'date-fns';
import { FilterConsultDTO } from '../../model/filterConsultDTO';
import { ConsultService } from '../../services/consult.service';
import { MatTableDataSource } from '@angular/material/table';
import { Consult } from '../../model/consult';
import { DatePipe, LowerCasePipe, UpperCasePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';

@Component({
  selector: 'app-search',
  imports: [MaterialModule, ReactiveFormsModule, MatTabsModule, UpperCasePipe, LowerCasePipe, DatePipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  form: FormGroup;  
  dataSource: MatTableDataSource<Consult>
  displayedColumns = [ 'patient', 'medic', 'date', 'actions' ]

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  private consultService = inject(ConsultService);
  private _dialog = inject(MatDialog);

  ngOnInit(): void {
    this.form = new FormGroup({
      dni: new FormControl(),
      fullname: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl()
    });
  }

  search(){
    if(this.tabGroup.selectedIndex == 0){
      //Option1
      const dni = this.form.value['dni'];
      const fullname = this.form.value['fullname']?.toLowerCase();

      const dto: FilterConsultDTO = new FilterConsultDTO(dni, fullname);
      this.consultService.searchOthers(dto).subscribe( data => this.createTable(data));

    }else{
      //Option2
      const date1 = format(this.form.value['startDate'], "yyyy-MM-dd'T'HH:mm:ss");
      const date2 = format(this.form.value['endDate'], "yyyy-MM-dd'T'HH:mm:ss");

      this.consultService.searchDates(date1, date2).subscribe(data => this.createTable(data));
    }    
  }

  createTable(data: Consult[]){
    this.dataSource = new MatTableDataSource(data);
  }

  viewDetails(consult: Consult){
    this._dialog.open(SearchDialogComponent, {
      width: '800px',
      data: consult
    });
  }
}
