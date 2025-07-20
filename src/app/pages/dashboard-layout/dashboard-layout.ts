import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, MatIcon, MatIconButton, MatListItem, MatNavList, MatSidenav, MatSidenavContainer, MatSidenavContent, MatToolbar, RouterLink, RouterLinkActive, RouterOutlet, MatIcon],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayout {
  username: string = 'Nipun';
  constructor(private router: Router) {}

  onLogout() {
    // TODO: Clear any stored authentication tokens/session here
    localStorage.removeItem('authToken'); // example

    // Navigate to login page after logout
    this.router.navigate(['/login']);
  }
}
