import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address, Showrun, Showtime } from './../util/models';
import { AboutComponent } from './../about/about.component';
import { ProjectsComponent } from './../projects/projects.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AboutComponent,
    ProjectsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {
}
