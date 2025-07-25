import { inject, Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Menu } from '../model/menu';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService extends GenericService<Menu> {
  private menuChange = new Subject<Menu[]>();

  constructor() {
    super(inject(HttpClient), `${environment.HOST}/menus`);
  }

  getMenusByUser() {
    return this.http.post<Menu[]>(`${environment.HOST}/menus/user`, {});
  }

  getMenuChange(){
    return this.menuChange.asObservable();
  }

  setMenuChange(menus: Menu[]){
    this.menuChange.next(menus);
  }
}
