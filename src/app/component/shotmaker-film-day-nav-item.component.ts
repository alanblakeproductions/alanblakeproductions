import { Component, Input, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { FilmDay, Location, LocationOption } from './../util/shotmaker-location-models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-shotmaker-film-day-nav-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './shotmaker-film-day-nav-item.component.html',
  styleUrl: './shotmaker-film-day-nav-item.component.less'
})
export class ShotmakerFilmDayNavItem {

  @Input() filmDay: FilmDay = {} as FilmDay;

  getLabelClass(filmDay: FilmDay): string {
    return "";
  }
}
