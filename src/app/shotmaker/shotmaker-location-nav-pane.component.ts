import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Location } from './../util/models';

import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { MomentModule } from 'ngx-moment';

@Component({
  selector: 'app-shotmaker-location-nav-pane',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MomentModule,
  ],
  templateUrl: './shotmaker-location-nav-pane.component.html',
  styleUrl: './shotmaker-location-nav-pane.component.less'
})
export class ShotmakerLocationNavPane implements OnInit {

  @Input() locations$: Subject<Location[]> = new Subject();
  locations: Location[] = [];

  projectId: string = "";

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['projectId'] ?? "ballad-of-the-night-owl";
    });

    this.locations$.subscribe(locations => {
      this.locations = locations;
    });
  }

  getLocationLabel(location: Location): string {
    switch(location.intExt) {
      case "INT/EXT":
        return "I/E";
      default:
        return location.intExt;
    }
  }

  getLocationLabelClass(location: Location): string {
    switch (location.timeOfDay) {
      case "DAY":
        return "uk-label-danger";
      case "EVENING":
        return "uk-label-warning";
      case "NIGHT":
        return "uk-label-success";
      default:
        return "";
    }
  }
}
