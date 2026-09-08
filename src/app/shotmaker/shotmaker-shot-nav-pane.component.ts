import { Component, Input, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ShotmakerSceneNavItem } from './../component/shotmaker-scene-nav-item.component';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Shot } from './../util/models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { MomentModule } from 'ngx-moment';

@Component({
  selector: 'app-shotmaker-shot-nav-pane',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag,
    MomentModule,
    ShotmakerSceneNavItem,
  ],
  templateUrl: './shotmaker-shot-nav-pane.component.html',
  styleUrl: './shotmaker-shot-nav-pane.component.less'
})
export class ShotmakerShotNavPane implements OnInit {

  @Input() shots$: Subject<Shot[]> = new Subject();
  shots: Shot[] = [];

  projectId: string = "";
  status: string = "";
  shotsShootTimeHours: number = 0;
  shotsShootTimeMinutes: number = 0;

  @ViewChildren("shotElement") shotElements!: QueryList<ElementRef<HTMLLIElement>>;

  constructor(
    private route: ActivatedRoute,
    private browserStorageService: BrowserStorageService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['projectId'] ?? "colorblind";
    });

    this.route.queryParams.subscribe((params) => {
      this.status = params['status'] ?? "todo";
    });

    this.shots$.subscribe(shots => {
      this.shots = shots.sort((a, b) => {
        let aOrder = this.browserStorageService.getShotOrder(this.projectId, this.status, a.id);
        let bOrder = this.browserStorageService.getShotOrder(this.projectId, this.status, b.id);
        return aOrder - bOrder;
      });
      let shotsShootTime = shots.reduce((sum, shot) => sum + shot.shootTime, 0);
      this.shotsShootTimeHours = Math.floor(shotsShootTime / 60);
      this.shotsShootTimeMinutes = shotsShootTime % 60;
    });
  }

  getShotSettingLabel(shot: Shot): string {
    if (shot.scene) {
      switch (shot.scene.setting) {
        case "INT/EXT":
          return "I/E";
        default:
          return shot.scene.setting;
      }
    }
    return "";
  }

  getShotSizeLabel(shot: Shot): string {
    if (shot.shotSize) {
      let spaceIndex = shot.shotSize.indexOf(" ");
      if (spaceIndex > -1) {
        return shot.shotSize.slice(0, spaceIndex);
      }
    }
    return shot.shotSize;
  }

  getShotSettingClass(shot: Shot): string {
    if (shot.scene) {
      switch (shot.scene.setting) {
        case "EXT":
          return "uk-label-black";
        case "INT":
          return "uk-label-light-gray";
        default:
          return "uk-label-gray";
      }
    }
    return "";
  }

  getShotSizeClass(shot: Shot): string {
    switch (shot.shotSize) {
      case "LS":
      case "LS (OTS)":
        return "uk-label-success";
      case "MS":
      case "MS (OTS)":
        return "uk-label-warning";
      case "CU":
      case "CU (OTS)":
        return "uk-label-danger";
      default:
        return "";
    }
  }

  dropShot(event: CdkDragDrop<Shot[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    for (let i = 0; i < event.container.data.length; i++) {
      let shot = event.container.data[i];
      let shotId = shot.id;

      this.browserStorageService.setShotOrder(this.projectId, this.status, shotId, i);
    }
  }
}
