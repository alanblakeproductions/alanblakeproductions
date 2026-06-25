import { Component, Input, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ShotmakerFilmDaysDetailPane } from './shotmaker-film-days-detail-pane.component';
import { Scene, Location, FilmDay } from './../util/shotmaker-location-models';
import { ShotmakerFilmDayNavItem } from './../component/shotmaker-film-day-nav-item.component';
import { ShotmakerProject } from './../util/models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { Observable, BehaviorSubject, Subject, combineLatest, of } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-shotmaker-film-days-nav-pane',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ShotmakerFilmDaysDetailPane,
    ShotmakerFilmDayNavItem,
  ],
  templateUrl: './shotmaker-film-days-nav-pane.component.html',
  styleUrl: './shotmaker-film-days-nav-pane.component.less'
})
export class ShotmakerFilmDaysNavPane implements OnInit, AfterViewInit {

  @Input() project: ShotmakerProject = {} as ShotmakerProject;
  @Input() filmDays$: BehaviorSubject<FilmDay[]> = new BehaviorSubject<FilmDay[]>([]);
  @Input() selectedFilmDay$: BehaviorSubject<FilmDay | undefined> = new BehaviorSubject<FilmDay | undefined>(undefined);
  filmDays: FilmDay[] = [];
  selectedFilmDay: FilmDay | undefined = undefined;

  @ViewChildren("filmDayElement") filmDayElements!: QueryList<ElementRef<HTMLLIElement>>;

  tab: string = "";

  constructor(
    private route: ActivatedRoute,
    private browserStorageService: BrowserStorageService
  ) {
  }

  ngOnInit(): void {
    combineLatest([
      this.route.params,
      this.route.queryParams,
      this.filmDays$,
      this.selectedFilmDay$
    ]).subscribe(
      ([params, queryParams, filmDays, selectedFilmDay]) => {
        this.tab = queryParams['tab'];
        this.filmDays = filmDays.sort((a, b) => {
          return a.date.localeCompare(b.date);
        });
        this.selectedFilmDay = selectedFilmDay;
      });
  }

  ngAfterViewInit(): void {
    this.selectedFilmDay$.pipe(first()).subscribe((selectedFilmDay) => {
      if (!selectedFilmDay) {
        return;
      }
      setTimeout(() => {
        const filmDayElement = this.filmDayElements.find(element => element.nativeElement.id === `film-day-${selectedFilmDay.date}`);
        filmDayElement?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 500);
    });
  }

  getLabel(filmDay: FilmDay): string {
    return `${filmDay.date}`;
  }
}
