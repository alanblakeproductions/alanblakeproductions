import { Component, HostListener, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ShotmakerShadowsComponent } from './shotmaker-shadows.component';
import { ShotmakerShotlistComponent } from './shotmaker-shotlist.component';
import { ShotmakerProject, ShotmakerProjectSummary, ShotmakerProjectShotlist, ShotmakerProjectVideo, Shadow, Shot } from './../util/models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { map, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-shotmaker-project',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    ShotmakerShadowsComponent,
    ShotmakerShotlistComponent,
  ],
  templateUrl: './shotmaker-project.component.html',
  styleUrl: './shotmaker-project.component.less'
})
export class ShotmakerProjectComponent implements OnInit {

  SHOTMAKER_PROJECTS: Record<string, ShotmakerProject> = {
    "colorblind": {
      id: "colorblind",
      summary: {
        title: "Colorblind",
      },
      shotlist: {
        file: "assets/shotmaker/colorblind.shotlist.csv",
      },
      shadows: {
        file: "assets/shotmaker/colorblind.shadows.csv",
      },
      video: {
        link: "assets/shotmaker/colorblind-demo-v4.mov",
      }
    }
  };

  project: ShotmakerProject = {} as ShotmakerProject;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private browserStorageService: BrowserStorageService
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(map(params => params['projectId']), distinctUntilChanged()).subscribe(projectId => {
      this.project = this.SHOTMAKER_PROJECTS[projectId];
    });
  }
}
