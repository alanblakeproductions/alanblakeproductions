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
  selector: 'app-shotmaker-shotlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    ShotmakerShotDetailPane,
    ShotmakerShotNavPane,
  ],
  templateUrl: './shotmaker-shotlist.component.html',
  styleUrl: './shotmaker-shotlist.component.less'
})
export class ShotmakerShotlistComponent implements OnInit {

  @Input() project: ShotmakerProject = {} as ShotmakerProject;

  private shots$: Subject<Shot[]> = new Subject();
  shotsWithStatus$: Subject<Shot[]> = new Subject();

  shot$: Subject<Shot> = new Subject();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private browserStorageService: BrowserStorageService
  ) {
  }

  ngOnInit(): void {
    this.shots$.subscribe(shots => {
      this.route.params.subscribe(params => {
        if (params['tab'] !== 'shotlist') {
          return;
        }

        if (params['status']) {
          let status = params['status'];
          let shotsWithStatus = shots.filter(shot => {
            return this.browserStorageService.getShotStatus(this.project.id, shot.id) === status;
          });
          this.shotsWithStatus$.next(shotsWithStatus);

          if (params['shotId']) {
            let shotId = Number(params['shotId']);
            let shot = shots.find((shot) => shot.id === shotId) ?? {} as Shot;
            this.shot$.next(shot);
          }
          else if (shotsWithStatus.length > 0) {
            this.router.navigate(['shotmaker', this.project.id, 'shotlist', status, shotsWithStatus[0].id]);
          }
        }
        else {
          this.router.navigate(['shotmaker', this.project.id, 'shotlist', 'todo']);
        }
      });
    });

    const shotlistCsvFilePath = this.project.shotlist.file;
    const shotlistCsvFileContents$ = this.http.get(shotlistCsvFilePath, { responseType: 'text'});

    shotlistCsvFileContents$.subscribe(csvFileContents => {
      console.log("Loading ", shotlistCsvFilePath);
      let rows = csvFileContents.trim().split("\n");
      let headers = rows[0].split("\t");
      let headerToIndex: Record<string, number> = {};
      for (var i = 0; i < headers.length; i++) {
        headerToIndex[headers[i]] = i;
      }

      let shots = [];

      for (var i = 1; i < rows.length; i++) {
        let id = i;
        let row = rows[i];
        let cells = row.split("\t");
        while (headers.length !== cells.length) {
          let nextRow = rows[++i];
          let nextCells = nextRow.split("\t");
          cells[cells.length - 1] += "\n" + nextCells[0];
          cells.push(...nextCells.slice(1, nextCells.length));
        }

        let scene = cells[headerToIndex["SCENE #"]];
        let setup = cells[headerToIndex["SETUP #"]];
        let shotId = cells[headerToIndex["SHOT #"]];
        let projectShot = {
          id: id,
          scene: scene,
          setup: setup,
          shotId: shotId,
          subject: cells[headerToIndex["SUBJECT"]],
          shotSize: cells[headerToIndex["SHOT SIZE"]],
          camera: cells[headerToIndex["CAMERA"]],
          angle: cells[headerToIndex["ANGLE"]],
          movement: cells[headerToIndex["MOVEMENT"]],
          lens: cells[headerToIndex["LENS"]],
          notes: cells[headerToIndex["NOTES"]],
          pages: cells[headerToIndex["PAGE(S)"]].replaceAll("\n", "<br/>").replaceAll('"', ""),
          priority: cells[headerToIndex["PRIORITY"]],
          imageLink: "assets/" + this.project.id + "/shots/" + this.project.id + "-scene-" + scene + "-" + setup + shotId + ".png",
          shootTime: Number(cells[headerToIndex["SHOOT TIME (MIN)"]]),
        } as Shot;
        shots.push(projectShot);
      }
      this.shots$.next(shots);
    });
  }

  clearShotOrder(): void {
    this.browserStorageService.clearShotOrder(this.project.id);
    window.location.reload();
  }
}
