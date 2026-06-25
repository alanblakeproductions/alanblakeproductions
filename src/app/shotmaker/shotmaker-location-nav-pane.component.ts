import { Component, Input, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ShotmakerLocationDetailPane } from './shotmaker-location-detail-pane.component';
import { ShotmakerSceneNavItem } from './../component/shotmaker-scene-nav-item.component';
import { Scene, Location } from './../util/shotmaker-location-models';
import { ShotmakerProject } from './../util/models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { Observable, BehaviorSubject, Subject, of, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-shotmaker-location-nav-pane',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ShotmakerLocationDetailPane,
    ShotmakerSceneNavItem,
  ],
  templateUrl: './shotmaker-location-nav-pane.component.html',
  styleUrl: './shotmaker-location-nav-pane.component.less'
})
export class ShotmakerLocationNavPane implements OnInit, AfterViewInit {

  @Input() project: ShotmakerProject = {} as ShotmakerProject;
  @Input() scenes$: BehaviorSubject<Scene[]> = new BehaviorSubject<Scene[]>([]);
  @Input() selectedScene$: BehaviorSubject<Scene | undefined> = new BehaviorSubject<Scene | undefined>(undefined);
  scenes: Scene[] = [];
  selectedScene: Scene | undefined = undefined;

  @ViewChildren("sceneElement") sceneElements!: QueryList<ElementRef<HTMLLIElement>>;

  view: string = "";

  constructor(
    private route: ActivatedRoute,
    private browserStorageService: BrowserStorageService
  ) {
  }

  ngOnInit(): void {
    combineLatest([
      this.route.params,
      this.route.queryParams,
      this.scenes$,
      this.selectedScene$
    ]).subscribe(
      ([params, queryParams, scenes, selectedScene]) => {
        this.view = queryParams['view'] ?? "scenes";
        this.scenes = scenes.sort((a, b) => {
          let aId = Number(a.id.match(/(^\d+)/g));
          let bId = Number(b.id.match(/(^\d+)/g));
          let compare = aId - bId;
          if (compare == 0) {
            return a.id.localeCompare(b.id);
          }
          return compare;
        });
        this.selectedScene = selectedScene;
      });
  }

  ngAfterViewInit(): void {
    this.selectedScene$.pipe(first()).subscribe((selectedScene) => {
      if (!selectedScene) {
        return;
      }
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
}
