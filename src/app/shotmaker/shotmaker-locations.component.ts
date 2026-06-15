import { Component, HostListener, Input, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ShotmakerLocationDetailPane } from './shotmaker-location-detail-pane.component';
import { ShotmakerLocationNavPane } from './shotmaker-location-nav-pane.component';
import { GoogleDriveFile, ShotmakerProject, ShotmakerProjectLocations, Location, LocationOption } from './../util/models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { Observable, BehaviorSubject, Subject, of, forkJoin } from 'rxjs';
import { GoogleDriveService } from './../service/google-drive.service';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-shotmaker-locations',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ShotmakerLocationDetailPane,
    ShotmakerLocationNavPane,
  ],
  templateUrl: './shotmaker-locations.component.html',
  styleUrl: './shotmaker-locations.component.less'
})
export class ShotmakerLocationsComponent implements OnInit {

  @Input() project: ShotmakerProject = {} as ShotmakerProject;

  isLoggedIn: Boolean = false;

  locations$: Subject<Location[]> = new Subject();
  locationOptions$: Subject<LocationOption[]> = new Subject();
  locationOptionFolders$: Subject<GoogleDriveFile[]> = new Subject();

  selectedLocation$: Subject<Location> = new Subject();
  selectedLocationOptions$: Subject<Record<number, LocationOption>> = new Subject();
  selectedLocationOptionFolders$: Subject<Record<number, GoogleDriveFile>> = new Subject();

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

    this.googleService.getAuthStatus().subscribe((authStatus) => {
      this.onAuthStatusChange(authStatus);
    });

    var googleAccessToken = this.browserStorageService.getGoogleAccessToken();
    if (googleAccessToken) {
      this.onAuthStatusChange(true);
    }

    this.locations$.subscribe(locations => {
      this.locationOptions$.subscribe(locationOptions => {
        this.locationOptionFolders$.subscribe(files => {
          console.log(`Loaded ${locations.length} locations`);
          console.log(`Loaded ${locationOptions.length} location options`);
          console.log(`Loaded ${files.length} location option folders`);

          let allLocationOptionFolders = Object.fromEntries(files
              .map(file => [Number(file.name), file]));

          this.route.params.subscribe(params => {
            if (!params['status']) {
              return;
            }

            let selectedLocationId = Number(params['status']);
            let selectedLocation = locations.find((location) => location.id === selectedLocationId) ?? {} as Location;
            if (!selectedLocation) {
              return;
            }

            let selectedLocationOptions = Object.fromEntries(
              locationOptions
                .filter((locationOption) => locationOption.locationId === selectedLocationId)
                .map((locationOption) => [locationOption.id, locationOption]));
            let selectedLocationOptionFolders = Object.fromEntries(Object
                .entries(allLocationOptionFolders)
                .filter(([optionId]) => Object.hasOwn(selectedLocationOptions, optionId)));

            let missingLocationOptionFolders = locationOptions.map(option => option.id).filter(optionId => !Object.hasOwn(allLocationOptionFolders, optionId));
            if (missingLocationOptionFolders.length === 0) {
              this.selectedLocation$.next(selectedLocation);
              this.selectedLocationOptions$.next(selectedLocationOptions);
              this.selectedLocationOptionFolders$.next(selectedLocationOptionFolders);
              return;
            }

            const missingLocationOptionFolderObservables: Observable<GoogleDriveFile>[] = missingLocationOptionFolders.map(optionId => {
              return this.googleService.createFolder(this.project.locations?.googleDriveFolderId ?? "", String(optionId));
            });

            forkJoin(missingLocationOptionFolderObservables)
              .subscribe({
                next: (missingLocationOptionFolders: GoogleDriveFile[]) => {
                  for (let missingLocationOptionFolder of missingLocationOptionFolders) {
                    console.log(`Created missing folder ${missingLocationOptionFolder.name}`);
                    selectedLocationOptionFolders[Number(missingLocationOptionFolder.name)] = missingLocationOptionFolder;
                  }

                  this.selectedLocation$.next(selectedLocation);
                  this.selectedLocationOptions$.next(selectedLocationOptions);
                  this.selectedLocationOptionFolders$.next(selectedLocationOptionFolders);
                },
                error: this.handleError
              });
          });
        });
      });
    });
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
    this.fetchLocations()
      .then(locations => {
        this.locations$.next(locations);

        this.fetchLocationOptions()
          .then(locationOptions => {
            this.locationOptions$.next(locationOptions);

            this.fetchLocationOptionFolders().subscribe({
              next: (locationOptionFolders) => {
                this.locationOptionFolders$.next(locationOptionFolders);
              },
              error: (error) => this.handleError(error)
            });
        }).catch(error => this.handleError(error));
      }).catch(error => this.handleError(error));
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.clearData();
      this.googleService.logout();
      window.location.reload();
    }
    else {
      console.error("Encountered error", error);
    }
  }

  private clearData(): void {
    this.locations$.next([]);
    this.locationOptions$.next([]);
    this.locationOptionFolders$.next([]);
  }

  private fetchLocations(): Promise<Location[]> {
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

        let projectLocations = [];
        for (var i = 1; i < rows.length; i++) {
          let row = rows[i];
          let cells = row.trim().split("\t");
          let locationId = Number(cells[headerToIndex["Location ID"]]);
          let scenes = cells[headerToIndex["Scenes"]].split(",").map(val => val.trim());
          let intExt = cells[headerToIndex["INT/EXT"]].trim();
          let timeOfDay = cells[headerToIndex["Time Of Day"]].trim();
          let description = cells[headerToIndex["Description"]].trim();
          let notes = cells[headerToIndex["Notes"]];

          projectLocations.push({
            id: locationId,
            scenes: scenes,
            intExt: intExt,
            timeOfDay: timeOfDay,
            description: description,
            notes: notes,
          });
        }

        return projectLocations;
      });
  }

  private fetchLocationOptions(): Promise<LocationOption[]> {
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

        let locationOptions = [];
        for (var i = 1; i < rows.length; i++) {
          let row = rows[i];
          let cells = row.trim().split("\t");
          let locationOptionId = Number(cells[headerToIndex["Option ID"]]);
          let locationId = Number(cells[headerToIndex["Location ID"]]);
          let description = cells[headerToIndex["Description"]];
          let address = cells[headerToIndex["Address"]];
          let notes = (cells[headerToIndex["Notes"]] ?? "").replace("  ", "<br/>");
          let contactName = cells[headerToIndex["Contact Name"]];
          let contactEmail = cells[headerToIndex["Contact Email"]];
          let contactPhone = cells[headerToIndex["Contact Phone"]];
          locationOptions.push({
            id: locationOptionId,
            locationId: locationId,
            description: description,
            address: address,
            notes: notes,
            contactName: contactName,
            contactEmail: contactEmail,
            contactPhone: contactPhone
          });
        }

        return locationOptions;
      });
  }

  private fetchLocationOptionFolders(): Observable<GoogleDriveFile[]> {
    return this.googleService.listFiles(this.project.locations?.googleDriveFolderId ?? "");
  }
}
