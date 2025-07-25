import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../model/patient';
import { switchMap, tap } from 'rxjs';
import { P } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-patient-edit',
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './patient-edit.component.html',
  styleUrl: './patient-edit.component.css'
})
export class PatientEditComponent {

  form: FormGroup;
  id: number;
  isEdit: boolean;  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ){}

  ngOnInit(): void {
    this.form = new FormGroup({
      idPatient: new FormControl(),
      firstName: new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(70) ]),
      lastName: new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(70) ]),
      dni: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.pattern['[0-9]+']),
      email: new FormControl('', Validators.email),
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }
  
  initForm(){
    if(this.isEdit){
      this.patientService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          idPatient: new FormControl(data.idPatient),
          firstName: new FormControl(data.firstName, [ Validators.required, Validators.minLength(3), Validators.maxLength(70) ]),
          lastName: new FormControl(data.lastName, [ Validators.required, Validators.minLength(3), Validators.maxLength(70) ]),
          dni: new FormControl(data.dni, Validators.required),
          address: new FormControl(data.address, Validators.required),
          phone: new FormControl(data.phone, Validators.pattern['[0-9]+']),
          email: new FormControl(data.email, Validators.email),
        });
      });
    }    
  }

  operate(){
    if(this.form.invalid){
      return;
    }

    const patient: Patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    //const x = this.form.controls['idPatient'].value;
    //const y = this.form.get('idPatient').value;
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.phone = this.form.value['phone'];
    patient.address = this.form.value['address'];
    patient.email = this.form.value['email'];

    console.log(patient);

    if(this.isEdit){
      //UPDATE
      //PRACTICA COMUN, NO IDEAL
      this.patientService.update(this.id, patient).subscribe( () => {
        this.patientService.findAll().subscribe(data => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('UPDATED!');
        });
      });
    }else{
      //SAVE
      //PRACTICA IDEAL, RECOMENDADA
      /*this.patientService.save(patient)
      .pipe(switchMap( () => this.patientService.findAll() ))      
      .subscribe(data => {
        this.patientService.setPatientChange(data);
      });*/
      this.patientService.save(patient).pipe(
         switchMap( () => this.patientService.findAll() ),
         tap(data => this.patientService.setPatientChange(data)),
         tap(() => this.patientService.setMessageChange('CREATED!'))
      ).subscribe();
    }

    this.router.navigate(['pages/patient']);
  }
  
  get f(){
    return this.form.controls;
  }
}
