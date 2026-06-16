import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Scene, Location } from './../util/shotmaker-location-models';

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

  @Input() scenes$: Subject<Scene[]> = new Subject();
  @Input() locations$: Subject<Location[]> = new Subject();
  scenes: Scene[] = [];
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

    this.scenes$.subscribe(scenes => {
      this.scenes = scenes;
      console.log(this.scenes);
    });
  }

  getLabel(scene: Scene): string {
    return scene.id;
  }

  getLabelClass(scene: Scene): string {
    switch (scene.timeOfDay) {
      case "EARLY MORNING":
      case "MORNING":
      case "DAY":
      case "AFTERNOON":
        return "uk-label-danger";
      case "EARLY EVENING":
      case "EVENING":
        return "uk-label-warning";
      case "NIGHT":
      case "LATE NIGHT":
        return "";
      default:
        return "uk-label-success";
    }
  }
}
