import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address, Highlight, Person, Project, ProjectType, ProjectSubType, Showtime } from './../util/models'

@Component({
  selector: 'app-sedgwick',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './sedgwick.component.html',
  styleUrl: './sedgwick.component.less'
})
export class SedgwickComponent {

  constructor() {
  }
}
