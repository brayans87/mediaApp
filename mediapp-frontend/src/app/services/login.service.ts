import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

interface ILoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string = `${environment.HOST}/login`;

  constructor(private http: HttpClient) { }

  login(username: string, password: string){
    const body: ILoginRequest = { username, password };

   // console.log(body);
    return this.http.post<any>(this.url, body);
  }
}
