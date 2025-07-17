import { inject, Injectable } from '@angular/core';
import { Exam } from '../model/exam';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ExamService extends GenericService<Exam>{

  constructor() { 
    super(
      inject(HttpClient),
      `${environment.HOST}/exams`
    );
  }
}
