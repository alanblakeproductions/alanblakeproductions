import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Address, Highlight, Person, Project, Showtime } from './../util/models'

@Component({
  selector: 'app-shotmaker',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './shotmaker.component.html',
  styleUrl: './shotmaker.component.less'
})
export class ShotmakerComponent {

  projectIds: String[] = [
    "colorblind",
    "love-me-knot-ep-5",
    "love-me-knot-ep-6"
  ];
}
