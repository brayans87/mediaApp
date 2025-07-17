import { Component, inject, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/patient';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ConsultDetail } from '../../model/consultDetail';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../model/exam';
import { MatListModule } from '@angular/material/list';
import { Medic } from '../../model/medic';
import { MedicService } from '../../services/medic.service';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Consult } from '../../model/consult';
import { format } from 'date-fns';
import { ConsultListExamDTOI } from '../../model/ConsultListExamDTOI';
import { ConsultService } from '../../services/consult.service';

@Component({
  selector: 'app-consult-wizard',
  imports: [
    MaterialModule,
    MatStepperModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatCardModule,
    ReactiveFormsModule,
    MatListModule,
    AsyncPipe,
    FlexLayoutModule,
    MatGridListModule
  ],
  templateUrl: './consult-wizard.component.html',
  styleUrl: './consult-wizard.component.css',
})
export class ConsultWizardComponent {
  firstFormGroup: FormGroup;
  patients$: Observable<Patient[]>;
  details: ConsultDetail[] = [];
  exams: Exam[];
  examsFiltered$: Observable<Exam[]>;
  examControl: FormControl = new FormControl();
  examsSelected: Exam[] = [];

  medics: Medic[] = [];
  medicSelected: Medic;
  consultArray: number[] = [];
  consultSelected: number;

  @ViewChild('stepper') stepper: MatStepper;

  //constructor(){}
  private patientService = inject(PatientService);
  private examService = inject(ExamService);
  private medicService = inject(MedicService);
  private consultService = inject(ConsultService);
  private _snbackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.firstFormGroup = new FormGroup({
      patient: new FormControl(),
      consultDate: new FormControl(new Date()),
      exam: this.examControl,
      diagnosis: new FormControl(),
      treatment: new FormControl(),
    });

    this.examsFiltered$ = this.examControl.valueChanges.pipe(
      map((val) => this.filterExams(val))
    );

    this.loadInitialData();
  }

  loadInitialData() {
    this.patients$ = this.patientService.findAll();
    this.examService.findAll().subscribe((data) => (this.exams = data));
    this.medicService.findAll().subscribe(data => this.medics = data);

    for(let i = 1; i <= 100; i++){
      this.consultArray.push(i);
    }

  }

  filterExams(val: any){
    if (val?.idExam > 0) {
      return this.exams.filter(
        (el) =>
          el.nameExam.toLowerCase().includes(val.nameExam.toLowerCase()) ||
          el.descriptionExam.toLowerCase().includes(val.descriptionExam.toLowerCase())
      );
    } else {
      return this.exams.filter(
        (el) =>
          el.nameExam.toLowerCase().includes(val?.toLowerCase()) ||
          el.descriptionExam.toLowerCase().includes(val?.toLowerCase())
      );
    }
  }

  showExam(val: any){
    return val ? val.nameExam : val;
  }

  addDetail() {
    const det = new ConsultDetail();
    det.diagnosis = this.firstFormGroup.value['diagnosis'];
    det.treatment = this.firstFormGroup.value['treatment'];

    this.details.push(det);
  }

  removeDetail(index: number) {
    this.details.splice(index, 1);
  }

  addExam() {
    const tmpExam: Exam = this.firstFormGroup.value['exam'];
    this.examsSelected.push(tmpExam);
  }

  selectMedic(m: Medic){
    this.medicSelected = m;
  }

  selectConsult(n: number){
    this.consultSelected = n;
  }

  nextManualStep(){
    if(this.consultSelected > 0){
      this.stepper.next();      
    }else{
      this._snbackBar.open('Please select a consult number', 'WARN', {duration: 2000});
    }
  }

  get f(){
    return this.firstFormGroup.controls;
  }

  save(){
    const consult = new Consult();
    consult.patient = this.firstFormGroup.value['patient'];
    consult.medic = this.medicSelected;
    consult.details = this.details;
    consult.numConsult = `C${this.consultSelected}`;
    consult.idUser = 1;
    consult.consultDate = format(this.firstFormGroup.value['consultDate'], "yyyy-MM-dd'T'HH:mm:ss");

    const dto: ConsultListExamDTOI = {
      consult: consult,
      lstExam: this.examsSelected
    };

    this.consultService.saveTransactional(dto).subscribe( () => {
      this._snbackBar.open('CREATED!', 'INFO', { duration: 2000});

      setTimeout( () => this.cleanControls(), 2000);
    });    
  }

  cleanControls(){
    this.firstFormGroup.reset();
    this.stepper.reset();
    this.details = [];
    this.examsSelected = [];
    this.consultSelected = 0;
    this.medicSelected = null;
  }
}
