import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Consult } from '../../../model/consult';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ConsultService } from '../../../services/consult.service';
import { Exam } from '../../../model/exam';

@Component({
  selector: 'app-search-dialog',
  imports: [MaterialModule, MatDialogModule, DatePipe, MatCardModule],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.css'
})
export class SearchDialogComponent {

  consult: Consult;
  exams: Exam[];

  readonly dialogRef = inject(MatDialogRef<SearchDialogComponent>);
  readonly data = inject<Consult>(MAT_DIALOG_DATA);
  private consultService = inject(ConsultService);

  ngOnInit(): void {
    this.consult = {...this.data};    
    this.consultService.getExamsByIdConsult(this.consult.idConsult).subscribe(data => this.exams = data);
  }
}
