import { Component, Input, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Scene, Location, FilmDay } from './../util/shotmaker-location-models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-shotmaker-film-days-nav-pane',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './shotmaker-film-days-nav-pane.component.html',
  styleUrl: './shotmaker-film-days-nav-pane.component.less'
})
export class ShotmakerFilmDaysNavPane implements OnInit, AfterViewInit {

  @Input() filmDays$: BehaviorSubject<FilmDay[]> = new BehaviorSubject<FilmDay[]>([]);
  @Input() selectedFilmDay$: BehaviorSubject<FilmDay | undefined> = new BehaviorSubject<FilmDay | undefined>(undefined);
  filmDays: FilmDay[] = [];

  @ViewChildren("filmDayElement") filmDayElements!: QueryList<ElementRef<HTMLLIElement>>;

  projectId: string = "";
  tab: string = "";

  constructor(
    private route: ActivatedRoute,
    private browserStorageService: BrowserStorageService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['projectId'] ?? "";
    });

    this.route.queryParams.subscribe((params) => {
      this.tab = params['tab'];
    });

    this.filmDays$.subscribe((filmDays) => {
      this.filmDays = filmDays.sort((a, b) => {
        return a.date.localeCompare(b.date);
      });
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

  getLabelClass(filmDay: FilmDay): string {
    return "";
  }
}
