import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Menu } from '../../model/menu';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-layout',
  imports: [
    MaterialModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    RouterLinkActive

  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {

  menus : Menu[];

  private menuService = inject(MenuService);

  ngOnInit():void {
    this.menuService.getMenuChange().subscribe(data => this.menus = data);
  }


}
