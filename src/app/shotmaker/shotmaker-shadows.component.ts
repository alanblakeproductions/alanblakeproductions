import { Component, HostListener, Input, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ShotmakerShotDetailPane } from './shotmaker-shot-detail-pane.component';
import { ShotmakerShotNavPane } from './shotmaker-shot-nav-pane.component';
import { ShotmakerProject, ShotmakerProjectSummary, ShotmakerProjectShotlist, ShotmakerProjectVideo, Shadow, Shot } from './../util/models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-shotmaker-shadows',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './shotmaker-shadows.component.html',
  styleUrl: './shotmaker-shadows.component.less'
})
export class ShotmakerShadowsComponent implements OnInit {

  @Input() project: ShotmakerProject = {} as ShotmakerProject;

  projectShadows$: Subject<Shadow[]> = new Subject();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private browserStorageService: BrowserStorageService
  ) {
  }

  ngOnInit(): void {
    const shadowsCsvFilePath = this.project.shadows.file;
    const shadowsCsvFileContents$ = this.http.get(shadowsCsvFilePath, { responseType: 'text'});
    shadowsCsvFileContents$.subscribe(csvFileContents => {
      let rows = csvFileContents.trim().split("\n");
      let headers = rows[0].split("\t");
      let headerToIndex: Record<string, number> = {};
      for (var i = 0; i < headers.length; i++) {
        headerToIndex[headers[i]] = i;
      }

      let projectShadows = [];
      for (var i = 1; i < rows.length; i++) {
        let row = rows[i];
        let cells = row.split("\t");
        let time = cells[headerToIndex["TIME"]];
        projectShadows.push({
          time: time,
          imageLink: "assets/" + this.project.id + "/shadows/" + this.project.id + "-shadow-" + time.replace(":", "") + ".png",
        });
      }

      this.projectShadows$.next(projectShadows);
    });
  }
}
