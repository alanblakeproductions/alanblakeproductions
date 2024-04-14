import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {

  copyrightYears: string;

  constructor() {
    let startYear = 2024;
    let currentYear = new Date().getFullYear();

    if (startYear == currentYear) {
      this.copyrightYears = "" + startYear;
    }
    else {
      this.copyrightYears = startYear + "-" + currentYear;
    }
  }
}
