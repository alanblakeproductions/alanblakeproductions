import { Component, HostListener, Input, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ShotmakerLocationDetailPane } from './shotmaker-location-detail-pane.component';
import { ShotmakerFilmDaysDetailPane } from './shotmaker-film-days-detail-pane.component';
import { ShotmakerLocationNavPane } from './shotmaker-location-nav-pane.component';
import { ShotmakerFilmDaysNavPane } from './shotmaker-film-days-nav-pane.component';
import { ShotmakerProject, ShotmakerProjectLocations } from './../util/models';
import { SceneEntity, Scene, LocationEntity, LocationOptionEntity, LocationOptionApprovalStatus, Location, LocationOption, FilmDay } from './../util/shotmaker-location-models';
import { GoogleDriveFile } from './../util/google-models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { GoogleDriveService } from './../service/google-drive.service';
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subject, combineLatest, of, forkJoin } from 'rxjs';

declare var UIkit: any;

@Component({
  selector: 'app-shotmaker-locations',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ShotmakerLocationDetailPane,
    ShotmakerFilmDaysDetailPane,
    ShotmakerLocationNavPane,
    ShotmakerFilmDaysNavPane,
  ],
  templateUrl: './shotmaker-locations.component.html',
  styleUrl: './shotmaker-locations.component.less'
})
export class ShotmakerLocationsComponent implements OnInit {

  @Input() project: ShotmakerProject = {} as ShotmakerProject;

  tab: string = "";
  entityId: string = "";
  isLoggedIn: Boolean = false;

  sceneEntities$: Subject<SceneEntity[]> = new Subject();
  locationEntities$: Subject<LocationEntity[]> = new Subject();
  locationOptionEntities$: Subject<LocationOptionEntity[]> = new Subject();

  scenes$: Subject<Scene[]> = new Subject();
  filmDays$: Subject<FilmDay[]> = new Subject();

  locationOptions$: Subject<LocationOption[]> = new Subject();
  locationOptionFolders$: Subject<GoogleDriveFile[]> = new Subject();

  selectedScene$: Subject<Scene> = new Subject();
  selectedFilmDay$: Subject<FilmDay> = new Subject();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private browserStorageService: BrowserStorageService,
    private googleService: GoogleDriveService,
  ) {
  }

  ngOnInit(): void {
    if (!this.project.locations) {
      return;
    }

    this.route.params.subscribe((params) => {
      this.tab = params['tab'];
      this.entityId = params['shotId']
    });

    this.googleService.getAuthStatus().subscribe((authStatus) => {
      this.onAuthStatusChange(authStatus);
    });

    var googleAccessToken = this.browserStorageService.getGoogleAccessToken();
    if (googleAccessToken) {
      this.onAuthStatusChange(true);
    }

    const data$ = combineLatest([
      this.sceneEntities$,
      this.locationEntities$,
      this.locationOptionEntities$,
      this.locationOptionFolders$
    ]).pipe(
      map(([sceneEntities, locationEntities, locationOptionEntities, files]) => {
        console.log(`Loaded ${sceneEntities.length} scenes`);
        console.log(`Loaded ${locationEntities.length} locations`);
        console.log(`Loaded ${locationOptionEntities.length} location options`);
        console.log(`Loaded ${files.length} location option folders`);

        let locationEntitiesById = Object.fromEntries(locationEntities.map(entity => [entity.id, entity]));
        let locationOptionEntitiesByLocationId = locationOptionEntities.reduce((map, entity) => {
          if (!map.has(entity.locationId)) {
            map.set(entity.locationId, []);
          }
          map.get(entity.locationId)!.push(entity);
          return map;
        }, new Map<number, LocationOptionEntity[]>());

        let allLocationOptionFolders = Object.fromEntries(files
            .map(file => [Number(file.name), file]));
        let missingLocationOptionFolders = locationOptionEntities
            .map(option => option.id)
            .filter(optionId => !Object.hasOwn(allLocationOptionFolders, optionId));
        if (missingLocationOptionFolders.length > 0) {
          console.log("Missing location option folders", missingLocationOptionFolders);
          const missingLocationOptionFolderObservables: Observable<GoogleDriveFile>[] = missingLocationOptionFolders.map(optionId => {
            return this.googleService.createFolder(this.project.locations?.googleDriveFolderId ?? "", String(optionId));
          });

          forkJoin(missingLocationOptionFolderObservables)
            .subscribe({
              next: (missingLocationOptionFolders: GoogleDriveFile[]) => {
                for (let missingLocationOptionFolder of missingLocationOptionFolders) {
                  console.log(`Created missing folder ${missingLocationOptionFolder.name}`);
                  allLocationOptionFolders[Number(missingLocationOptionFolder.name)] = missingLocationOptionFolder;
                }
              },
              error: (error) => this.handleError(error)
            });
        }

        let scenes: Record<string, Scene> = {};
        var locationIdToScenes: Record<number, Scene[]> = {};
        for (let sceneEntity of sceneEntities) {

          let locationOptionEntities = locationOptionEntitiesByLocationId.get(sceneEntity.locationId) ?? [];
          let locationOptions = locationOptionEntities.map((entity) => {
            let approvalStatus = entity.approvalStatus as LocationOptionApprovalStatus ?? LocationOptionApprovalStatus.NOT_APPROVED;

            let warnings: string[] = [];
            if (!([LocationOptionApprovalStatus.APPROVED, LocationOptionApprovalStatus.NOT_APPLICABLE].includes(approvalStatus))) {
              warnings.push("This location option has not yet been approved");
            }
            else if (approvalStatus !== LocationOptionApprovalStatus.NOT_APPLICABLE && entity.contacts.length === 0) {
              warnings.push("No contact exists for this location option");
            }
            if (entity.address === undefined || entity.address === "") {
              warnings.push("No address for this location option");
            }

            let folder = allLocationOptionFolders[entity.id];

            return {
              id: entity.id,
              description: entity.description,
              address: entity.address,
              addressCoordinates: undefined,
              addressPin: undefined,
              notes: entity.notes,
              approvalStatus: approvalStatus,
              contacts: entity.contacts,
              warnings: warnings,
              folder: folder,
              folderUrl: `https://drive.google.com/drive/u/1/folders/${folder.id}`,
              horizontalImages: [],
              verticalImages: [],
            }
          });

          let locationWarnings: string[] = [];
          if (locationOptions.length === 0) {
            locationWarnings.push("No location options exist for this scene yet");
          }
          let locationEntity = locationEntitiesById[sceneEntity.locationId];
          let location: Location = {
            id: locationEntity.id,
            name: locationEntity.name,
            notes: locationEntity.notes,
            sceneIds: [],
            warnings: locationWarnings,
            locationOptions: locationOptions,
          };

          let sceneWarnings: string[] = [];
          let scene = {
            id: sceneEntity.id,
            status: sceneEntity.status,
            setting: sceneEntity.setting,
            description: sceneEntity.description,
            timeOfDay: sceneEntity.timeOfDay,
            notes: sceneEntity.notes,
            filmDay: sceneEntity.filmDay,
            location: location,
            warnings: sceneWarnings,
            childWarnings: [...locationOptions.map(option => option.warnings).flat(), ...location.warnings],
          };
          scenes[sceneEntity.id] = scene;

          if (!Object.hasOwn(locationIdToScenes, sceneEntity.locationId)) {
            locationIdToScenes[sceneEntity.locationId] = [];
          }
          locationIdToScenes[sceneEntity.locationId].push(scene);
        }

        for (let scene of Object.values(scenes)) {
          scene.location.sceneIds = locationIdToScenes[scene.location.id].map(scene => scene.id).filter(sceneId => sceneId !== scene.id);
        }

        let filmDays: Record<string, FilmDay> = {};
        for (let scenes of Object.values(locationIdToScenes)) {
          for (let scene of scenes) {
            let filmDay = scene.filmDay;
            if (!filmDay) {
              filmDay = "Undecided";
            }

            if (!filmDays[filmDay]) {
              filmDays[filmDay] = {
                date: filmDay,
                scenes: [],
                warnings: [],
                childWarnings: [],

              };
            }
            filmDays[filmDay].scenes.push(scene);
            filmDays[filmDay].childWarnings.push(...scene.warnings);
            filmDays[filmDay].childWarnings.push(...scene.childWarnings);
          }
        }

        this.scenes$.next(Object.values(scenes));
        this.filmDays$.next(Object.values(filmDays));

        return {
          'scenes': scenes,
          'filmDays': filmDays
        };
      }),
      shareReplay(1));

    combineLatest([
      this.route.params,
      data$
    ]).subscribe(
      ([params, data]) => {
        let scenes: Record<string, Scene> = data['scenes'];
        let filmDays: Record<string, FilmDay> = data['filmDays'];

        if (params['tab'] === 'locations') {
          let selectedSceneId = params['shotId'];
          if (!selectedSceneId) {
            return;
          }

          let selectedScene = scenes[selectedSceneId];
          if (!selectedScene) {
            return;
          }
          this.selectedScene$.next(selectedScene);
        }
        else if (params['tab'] === 'film-days') {
          let selectedFilmDayId = params['status'];
          if (!selectedFilmDayId) {
            return;
          }

          let selectedFilmDay = filmDays[selectedFilmDayId];
          if (!selectedFilmDay) {
            return;
          }
          this.selectedFilmDay$.next(selectedFilmDay);
        }
        else {
          console.error(`Don't recognize tab ${params['tab']}`);
        }
      }
    );
  }

  onAuthStatusChange(isLoggedIn: boolean): void {
    console.log("onIsLoggedInChange: ", isLoggedIn);
    this.isLoggedIn = isLoggedIn;
    if (isLoggedIn) {
      this.loadData();
    }
    else {
      this.clearData();
    }
  }

  loadData(): void {
    this.fetchSceneEntities()
      .then(sceneEntities => {
        this.sceneEntities$.next(sceneEntities);
      }).catch(error => this.handleError(error));

    this.fetchLocationEntities()
      .then(locationEntities => {
        this.locationEntities$.next(locationEntities);
      }).catch(error => this.handleError(error));

    this.fetchLocationOptionEntities()
      .then(locationOptionEntities => {
        this.locationOptionEntities$.next(locationOptionEntities);
      }).catch(error => this.handleError(error));

    this.fetchLocationOptionFolders().subscribe({
      next: (locationOptionFolders) => {
        this.locationOptionFolders$.next(locationOptionFolders);
      },
      error: (error) => this.handleError(error)
    });
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.clearData();
      this.googleService.logout();
      window.location.reload();
    }
    else {
      console.error("Encountered error", error);
      UIkit.notification("<span uk-icon='icon: warning'></span> Encountered error");
    }
  }

  private clearData(): void {
    this.sceneEntities$.next([]);
    this.locationEntities$.next([]);
    this.locationOptionEntities$.next([]);
    this.locationOptionFolders$.next([]);
    this.scenes$.next([]);
  }

  private fetchSceneEntities(): Promise<SceneEntity[]> {
    return fetch(
      this.project.locations?.googleDriveScenesUrl ?? ""
    )
      .then((response) => response.text())
      .then((data) => {
        let rows = data.trim().split("\n");
        let headers = rows[0].split("\t");
        let headerToIndex: Record<string, number> = {};
        for (var i = 0; i < headers.length; i++) {
          headerToIndex[headers[i].trim()] = i;
        }

        let scenes: SceneEntity[] = [];
        for (var i = 1; i < rows.length; i++) {
          let row = rows[i];
          let cells = row.trim().split("\t").map(val => val.trim());
          let status = cells[headerToIndex["Status"]];
          if (status === "CUT" || status === "TITLE CARD") {
            continue;
          }

          let id = cells[headerToIndex["Scene ID"]];
          let setting = cells[headerToIndex["Setting"]];
          let description = cells[headerToIndex["Description"]];
          let timeOfDay = cells[headerToIndex["Time Of Day"]];
          let notes = (cells[headerToIndex["Notes"]] ?? "").split("  ");
          let filmDay = cells[headerToIndex["Film Day"]];
          let locationId = Number(cells[headerToIndex["Location ID"]]);

          scenes.push({
            id: id,
            status: status,
            setting: setting,
            description: description,
            timeOfDay: timeOfDay,
            notes: notes,
            filmDay: filmDay,
            locationId: locationId,
          });
        }

        return scenes;
      });
  }

  private fetchLocationEntities(): Promise<LocationEntity[]> {
    return fetch(
      this.project.locations?.googleDriveLocationsUrl ?? ""
    )
      .then((response) => response.text())
      .then((data) => {
        let rows = data.trim().split("\n");
        let headers = rows[0].split("\t");
        let headerToIndex: Record<string, number> = {};
        for (var i = 0; i < headers.length; i++) {
          headerToIndex[headers[i].trim()] = i;
        }

        let locations: LocationEntity[] = [];
        for (var i = 1; i < rows.length; i++) {
          let row = rows[i];
          let cells = row.trim().split("\t").map(val => val.trim());
          let id = Number(cells[headerToIndex["Location ID"]]);
          let name = cells[headerToIndex["Name"]];
          let notes = (cells[headerToIndex["Notes"]] ?? "").split("  ");

          locations.push({
            id: id,
            name: name,
            notes: notes,
          });
        }

        return locations;
      });
  }

  private fetchLocationOptionEntities(): Promise<LocationOptionEntity[]> {
    return fetch(
      this.project.locations?.googleDriveLocationOptionsUrl ?? ""
    )
      .then((response) => response.text())
      .then((data) => {
        let rows = data.trim().split("\n");
        let headers = rows[0].split("\t");
        let headerToIndex: Record<string, number> = {};
        for (var i = 0; i < headers.length; i++) {
          headerToIndex[headers[i].trim()] = i;
        }

        let locationOptions: LocationOptionEntity[] = [];
        for (var i = 1; i < rows.length; i++) {
          let row = rows[i];
          let cells = row.trim().split("\t").map(val => val.trim());
          let id = Number(cells[headerToIndex["Option ID"]]);
          let locationId = Number(cells[headerToIndex["Location ID"]]);
          let description = cells[headerToIndex["Description"]];
          let address = cells[headerToIndex["Address"]];
          let notes = (cells[headerToIndex["Notes"]] ?? "").split("  ");
          let approvalStatus = cells[headerToIndex["Approval Status"]];
          let contactNames = (cells[headerToIndex["Contact Name"]] ?? "").split(",");
          let contactEmails = (cells[headerToIndex["Contact Email"]] ?? "").split(",");
          let contactPhones = (cells[headerToIndex["Contact Phone"]] ?? "").split(",");
          let contacts = []
          if (contactNames.length !== contactEmails.length || contactEmails.length !== contactPhones.length) {
            console.error(`Row ${i} has improper contacts: names=[${contactNames}], emails=[${contactEmails}], phones=[${contactPhones}]`);
          }
          else {
            for (let i = 0; i < contactNames.length; i++) {
              contacts.push({
                name: contactNames[i],
                email: contactEmails[i],
                phone: contactPhones[i],
              });
            }
          }

          locationOptions.push({
            id: id,
            locationId: locationId,
            description: description,
            address: address,
            notes: notes,
            approvalStatus: approvalStatus,
            contacts: contacts
          });
        }

        return locationOptions;
      });
  }

  private fetchLocationOptionFolders(): Observable<GoogleDriveFile[]> {
    return this.googleService.listFiles(this.project.locations?.googleDriveFolderId ?? "");
  }
}
