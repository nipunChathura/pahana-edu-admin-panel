import { Component, signal } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { NgApexchartsModule } from "ng-apexcharts";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgApexchartsModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})

export class App {
  protected readonly title = signal('pahanaedu-admin-panel');
}
