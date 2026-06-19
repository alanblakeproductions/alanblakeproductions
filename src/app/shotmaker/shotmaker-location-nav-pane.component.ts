import { Component, Input, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Scene, Location } from './../util/shotmaker-location-models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-shotmaker-location-nav-pane',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './shotmaker-location-nav-pane.component.html',
  styleUrl: './shotmaker-location-nav-pane.component.less'
})
export class ShotmakerLocationNavPane implements OnInit, AfterViewInit {

  @Input() scenes$: Subject<Scene[]> = new Subject();
  @Input() selectedScene$: Subject<Scene> = new Subject();
  scenes: Scene[] = [];

  @ViewChildren("sceneElement") sceneElements!: QueryList<ElementRef<HTMLLIElement>>;

  projectId: string = "";
  view: string = "";

  constructor(
    private route: ActivatedRoute,
    private browserStorageService: BrowserStorageService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['projectId'] ?? "";
      this.view = params['status'] ?? "scenes";
    });

    this.scenes$.subscribe((scenes) => {
      this.scenes = scenes.sort((a, b) => {
        let aId = Number(a.id.match(/\d+/g));
        let bId = Number(b.id.match(/\d+/g));
        return aId - bId;
      });
    });
  }

  ngAfterViewInit(): void {
    this.selectedScene$.pipe(first()).subscribe((selectedScene) => {
      setTimeout(() => {
        const sceneElement = this.sceneElements.find(element => element.nativeElement.id === `scene-${selectedScene.id}`);
        sceneElement?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 500);
    });
  }

  getLabel(scene: Scene): string {
    if (this.view === "scenes") {
      return `${scene.setting}. ${scene.description}`;
    }
    return scene.location.name;
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
