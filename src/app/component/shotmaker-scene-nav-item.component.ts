import { Component, Input, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Scene, Location, LocationOption } from './../util/shotmaker-location-models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-shotmaker-scene-nav-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './shotmaker-scene-nav-item.component.html',
  styleUrl: './shotmaker-scene-nav-item.component.less'
})
export class ShotmakerSceneNavItem {

  @Input() scene: Scene = {} as Scene;
  @Input() sceneLabel: string = "";
  @Input() sceneDescription: string | undefined = undefined;

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
