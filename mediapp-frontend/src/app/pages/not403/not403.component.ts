import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not403',
  imports: [RouterLink],
  templateUrl: './not403.component.html',
  styleUrl: './not403.component.css'
})
export class Not403Component {

  username: string;

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    this.username = helper.decodeToken(token).sub;
  }

}
