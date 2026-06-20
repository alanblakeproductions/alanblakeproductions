import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ShotmakerProject } from './../util/models';
import { FilmDay, Location, LocationOption, LocationOptionImage, LocationOptionApprovalStatus, Scene } from './../util/shotmaker-location-models';
import { ShotmakerSceneNavItem } from './../component/shotmaker-scene-nav-item.component';
import { GoogleDriveService } from './../service/google-drive.service';
import { GoogleDriveFile, ImageDisplayDirection } from './../util/google-models';
import { Observable, Subject, BehaviorSubject, concat, of, forkJoin } from 'rxjs';
import { toArray } from 'rxjs/operators';

declare var UIkit: any;

@Component({
  selector: 'app-shotmaker-film-days-detail-pane',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GoogleMap,
    MapAdvancedMarker,
    RouterLink,
    RouterLinkActive,
    ShotmakerSceneNavItem,
  ],
  templateUrl: './shotmaker-film-days-detail-pane.component.html',
  styleUrl: './shotmaker-film-days-detail-pane.component.less'
})
export class ShotmakerFilmDaysDetailPane implements OnInit {

  @Input() project: ShotmakerProject = {} as ShotmakerProject;
  @Input() filmDay$: BehaviorSubject<FilmDay | undefined> = new BehaviorSubject<FilmDay | undefined>(undefined);

  @ViewChild("map") map!: google.maps.Map;

  mapCenter: google.maps.LatLngLiteral = {
    lat: 41.916746,
    lng: -87.687471
  };
  mapOptions: google.maps.MapOptions = {
    mapId: 'DEMO_MAP_ID'
  };
  mapZoom: number = 12;

  filmDay: FilmDay | undefined = undefined;
  loadingLocations: boolean = true;

  locationIdToLocation: Record<number, Location> = {};
  locationIdToScenes: Record<number, Scene[]> = {};

  selectedLocationIndex: number | undefined = undefined;
  selectedLocation: Location | undefined = undefined;
  selectedLocationOption: LocationOption | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private googleService: GoogleDriveService,
  ) {}

  ngOnInit(): void {
    this.filmDay$.subscribe(filmDay => {
      if (!filmDay) {
        return;
      }

      this.filmDay = filmDay;
      this.loadingLocations = true;
      this.locationIdToLocation = {};
      this.locationIdToScenes = {};

      for (let scene of filmDay.scenes) {
        this.locationIdToLocation[scene.location.id] = scene.location;
        if (!this.locationIdToScenes[scene.location.id]) {
          this.locationIdToScenes[scene.location.id] = [];
        }
        this.locationIdToScenes[scene.location.id].push(scene);
      }

      for (const [index, location] of Object.values(this.locationIdToLocation).entries()) {
        for (let locationOption of location.locationOptions) {
          this.loadLocation(index, locationOption);
        }
      }
    });
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.googleService.logout();
      window.location.reload();
    }
    else {
      console.error("Encountered error", error);
    }
  }

  private loadLocation(locationIndex: number, locationOption: LocationOption): void {
    if (!locationOption.address) {
      //console.error(`No address for location option ${locationOption.id}`);
      return;
    }

    this.googleService.getLocationCoordinates(locationOption.address)
      .then(coordinates => {
        if (Number.isNaN(coordinates.lat)) {
          console.log("Unable to set coordinates", locationOption.address, coordinates, typeof(coordinates));
          return;
        }
        locationOption.addressCoordinates = coordinates;
        locationOption.addressPin = new google.maps.marker.PinElement({
          scale: 1,
          glyphText: String(locationIndex + 1),
          background: this.getApprovalStatusPinColor(locationOption),
          borderColor: "white",
          glyphColor: "white",
        });
        /*
        let node = document.createElement('div');
        node.innerHTML = `
          <div class="uk-card-body">
            <h4>Test</h4>
          </div>
        `;
        */
      }).catch(error => this.handleError(error));
  }

  getOptionTitle(locationOption: LocationOption): string {
    if (locationOption.description) {
      return locationOption.description;
    }

    if (locationOption.address) {
      return locationOption.address;
    }

    return `Option ${locationOption.id}`;
  }

  getApprovalStatusClass(option: LocationOption): string {
    switch (option.approvalStatus) {
      case LocationOptionApprovalStatus.NOT_APPLICABLE:
      case LocationOptionApprovalStatus.APPROVED:
        return "uk-label-success";
      case LocationOptionApprovalStatus.PENDING_APPROVAL:
        return "uk-label-warning";
      case LocationOptionApprovalStatus.NOT_APPROVED:
        return "uk-label-danger";
      default:
        return "uk-label-warning";
    }
  }

  getApprovalStatusPinColor(option: LocationOption): string {
    switch (option.approvalStatus) {
      case LocationOptionApprovalStatus.NOT_APPLICABLE:
      case LocationOptionApprovalStatus.APPROVED:
        return "green";
      case LocationOptionApprovalStatus.PENDING_APPROVAL:
        return "yellow";
      case LocationOptionApprovalStatus.NOT_APPROVED:
        return "red";
      default:
        return "yellow";
    }
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

  getScenes(locationId: string): Scene[] {
    return this.locationIdToScenes[Number(locationId)];
  }

  onLocationClick(event: any): void {
    this.selectedLocationIndex = event['locationIndex'];
    this.selectedLocation = event['location'];
    this.selectedLocationOption = event['locationOption'];
  }
}
