import { Component, signal } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbar,
    RouterOutlet,
    MatSidenavContent,
    MatIconButton,
    MatIcon,
    MatSidenavContainer,
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    MatSidenav,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})

export class App {
  protected readonly title = signal('pahanaedu-admin-panel');
}
