import { inject, Injectable } from '@angular/core';
import { Specialty } from '../model/specialty';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService extends GenericService<Specialty>{

  constructor() { 
    super(
      inject(HttpClient),
      `${environment.HOST}/specialties`
    );
  }

}
