import { Component, HostListener, Input, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ShotmakerShotDetailPane } from './shotmaker-shot-detail-pane.component';
import { ShotmakerShotNavPane } from './shotmaker-shot-nav-pane.component';
import { ShotmakerProject, Shot } from './../util/models';
import { SceneEntity } from './../util/shotmaker-location-models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { ShotmakerService } from './../service/shotmaker.service';
import { Observable, BehaviorSubject, Subject, from, of, combineLatest, take, firstValueFrom } from 'rxjs';
import { distinctUntilChanged, map, switchMap, catchError, concatMap, first } from 'rxjs/operators';

declare var UIkit: any;

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

  private sceneEntities$: Subject<SceneEntity[]> = new Subject();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private browserStorageService: BrowserStorageService,
    private shotmakerService: ShotmakerService
  ) {
  }

  ngOnInit(): void {
    if (!this.project.shotlist) {
      return;
    }

    const data$ = combineLatest([
      this.route.queryParams,
      this.shots$,
      this.sceneEntities$
    ]).subscribe(
      ([queryParams, shots, sceneEntities]) => {
        if (queryParams['tab'] !== 'shotlist') {
          return;
        }

        let sceneIdToSceneEntity = new Map<string, SceneEntity>(sceneEntities.map(scene => [scene.id, scene] as const));
        for (let shot of shots) {
          shot.scene = sceneIdToSceneEntity.get(shot.sceneId);
        }

        if (queryParams['status']) {
          let status = queryParams['status'];
          let shotsWithStatus = shots.filter(shot => {
            return this.browserStorageService.getShotStatus(this.project.id, shot.id) === status;
          });
          this.shotsWithStatus$.next(shotsWithStatus);

          if (queryParams['shotId']) {
            let shotId = Number(queryParams['shotId']);
            let shot = shots.find((shot) => shot.id === shotId) ?? {} as Shot;
            this.shot$.next(shot);
          }
          else if (shotsWithStatus.length > 0) {
            this.router.navigate(
              ['shotmaker', this.project.id],
              {
                queryParams: {
                  tab: 'shotlist',
                  status: status,
                  shotId: shotsWithStatus[0].id,
                }
              });
          }
        }
        else {
          this.router.navigate(
            ['shotmaker', this.project.id],
            {
              queryParams: {
                tab: 'shotlist',
                status: 'todo'
              }
            });
        }
      }
    );

    this.loadData();
  }

  private loadData(): void {
    this.shotmakerService.fetchSceneEntities(this.project.locations?.googleDriveScenesUrl ?? "")
      .then(sceneEntities => {
        this.sceneEntities$.next(sceneEntities);
      }).catch(error => this.handleError(error));

    this.fetchShotlist()
      .then(shots => {
        this.shots$.next(shots);
      }).catch(error => this.handleError(error));
  }

  private fetchShotlist(): Promise<Shot[]> {
    const shotlistCsvFilePath = this.project.shotlist?.file ?? "";
    const shotlistCsvFileContents$ = this.fetchShotlistCsv(shotlistCsvFilePath);

    return shotlistCsvFileContents$.then(csvFileContents => {
      console.log("Loading ", shotlistCsvFilePath);
      let rows = csvFileContents.trim().split("\n");
      let headers = rows[0].trim().split("\t");
      let headerToIndex: Record<string, number> = {};
      for (var i = 0; i < headers.length; i++) {
        headerToIndex[headers[i]] = i;
      }

      let shots = [];
      for (var i = 1; i < rows.length; i++) {
        let id = i;
        let row = rows[i];
        if (row === undefined) {
          break;
        }
        let cells = row.split("\t");
        while (headers.length !== cells.length) {
          let nextRow = rows[++i];
          let nextCells = nextRow.split("\t");
          cells[cells.length - 1] += "\n" + nextCells[0];
          cells.push(...nextCells.slice(1, nextCells.length));
        }

        let sceneId = cells[headerToIndex["SCENE #"]];
        let setup = cells[headerToIndex["SETUP #"]];
        let shotId = cells[headerToIndex["SHOT #"]];

        let projectShot = {
          id: id,
          sceneId: sceneId,
          scene: undefined,
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
          mic: cells[headerToIndex["MIC"]],
          imageLink: this.getImage("assets/" + this.project.id + "/shots/" + this.project.id + "-scene-" + sceneId + "-" + setup + shotId),
          shootTime: Number(cells[headerToIndex["SHOOT TIME (MIN)"]]),
        } as Shot;
        shots.push(projectShot);
      }
      return shots;
    });
  }

  private async getImage(pathWithNoExtension: string): Promise<string> {
    const extensions: string[] = ['png', 'gif', 'mp4'];
    const result = await firstValueFrom(
      from(extensions).pipe(
        concatMap(extension => {
          const path = `${pathWithNoExtension}.${extension}`;

          return this.http.head(path).pipe(
            map(() => {
              return path;
            }),
            catchError(() => {
              return of(null);
            })
          );
        }),
        first(path => path !== null, null)
      )
    );

    return result ?? 'MISSING';
  }

  private fetchShotlistCsv(filepath: string): Promise<any> {
    if (filepath.startsWith("http")) {
      return fetch(filepath).then((response) => response.text());
    }
    else {
      return new Promise((resolve, reject) => {
        this.http.get(filepath, { responseType: 'text' }).subscribe((response) => {
          resolve(response);
        });
      });
    }
  }

  private clearData(): void {
    this.shots$.next([]);
    this.sceneEntities$.next([]);
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.clearData();
      window.location.reload();
    }
    else {
      console.error("Encountered error", error);
      UIkit.notification("<span uk-icon='icon: warning'></span> Encountered error");
    }
  }

  clearShotOrder(): void {
    this.browserStorageService.clearShotOrder(this.project.id);
    window.location.reload();
  }
}
