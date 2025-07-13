import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, MatButton, RouterLink, MatIcon, RouterOutlet, MatToolbar,],
  templateUrl: './book.html',
  styleUrl: './book.scss'
})
export class Book {

}
