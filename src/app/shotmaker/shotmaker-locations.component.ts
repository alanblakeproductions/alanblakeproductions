import { Component, HostListener, Input, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ShotmakerLocationDetailPane } from './shotmaker-location-detail-pane.component';
import { ShotmakerLocationNavPane } from './shotmaker-location-nav-pane.component';
import { GoogleDriveFile, ShotmakerProject, ShotmakerProjectLocations, Location, LocationOption } from './../util/models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
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
  location$: Subject<Location> = new Subject();

  locationOptions$: Subject<LocationOption[]> = new Subject();
  locationOptionsForLocation$: Subject<LocationOption[]> = new Subject();

  locationOption$: Subject<LocationOption> = new Subject();
  locationOptionFolder$: Subject<GoogleDriveFile> = new Subject();

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
    this.locations$.subscribe(locations => {
      this.locationOptions$.subscribe(locationOptions => {
        this.googleService.listFiles(this.project.locations?.googleDriveFolderId ?? "").subscribe((files: GoogleDriveFile[]) => {
          console.log(`Loaded ${locations.length} locations`);
          console.log(`Loaded ${locationOptions.length} location options`);
          console.log(`Loaded ${files.length} location option folders`);
          this.route.params.subscribe(params => {
            if (params['tab'] !== 'locations') {
              return;
            }

            if (params['status']) {
              let locationId = Number(params['status']);
              let location = locations.find((location) => location.id === locationId) ?? {} as Location;
              this.location$.next(location);

              let locationOptionsForLocation = locationOptions.filter((locationOption) => locationOption.locationId === locationId);
              this.locationOptionsForLocation$.next(locationOptionsForLocation);

              if (params['status']) {
                let locationOptionId = Number(params['status']);
                let locationOption = locationOptionsForLocation.find((locationOption) => locationOption.id === locationOptionId) ?? {} as LocationOption;

                var locationOptionFolder = files.find(file => locationOptionId === Number(file.name));
                if (locationOptionFolder) {
                  this.locationOption$.next(locationOption);
                  this.locationOptionFolder$.next(locationOptionFolder);
                }
                else {
                  // Create
                }
              }
            }
          });
        });
      });
    });

    this.fetchLocations();

  }

  clearData(): void {
    this.locations$.next([]);
    this.locationOptions$.next([]);
  }

  fetchLocations(): void {
    if (!this.project.locations) {
      return;
    }
    fetch(
      this.project.locations.googleDriveLocationsUrl
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
          let scenes = cells[headerToIndex["Scenes"]].split(",").map(val => Number(val));
          let intExt = cells[headerToIndex["INT/EXT"]];
          let timeOfDay = cells[headerToIndex["Time Of Day"]];
          let description = cells[headerToIndex["Description"]];
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

        this.locations$.next(projectLocations);

        this.fetchLocationOptions();
      });
  }

  fetchLocationOptions(): void {
    if (!this.project.locations) {
      return;
    }
    fetch(
      this.project.locations.googleDriveLocationOptionsUrl
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
          let notes = cells[headerToIndex["Notes"]];
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

        this.locationOptions$.next(locationOptions);
      });
  }
}
