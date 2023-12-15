import { Component } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
      menu.classList.toggle('show');
    }
  }
}
