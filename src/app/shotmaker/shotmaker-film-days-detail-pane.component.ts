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
  loadingImages: boolean = true;

  locations: Location[] = [];
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
      this.selectedLocationIndex = undefined;
      this.selectedLocation = undefined;
      this.selectedLocationOption = undefined;
      if (!filmDay) {
        return;
      }

      this.filmDay = filmDay;
      this.loadingLocations = true;
      this.locations = [];
      this.locationIdToLocation = {};
      this.locationIdToScenes = {};

      for (let scene of filmDay.scenes) {
        this.locationIdToLocation[scene.location.id] = scene.location;
        if (!this.locationIdToScenes[scene.location.id]) {
          this.locationIdToScenes[scene.location.id] = [];
        }
        this.locationIdToScenes[scene.location.id].push(scene);
      }

      let sceneIdToOrderIndex: Record<string, number> = Object.fromEntries(
        filmDay.scenes.map((scene, index) => [scene.id, index]));
      this.locations = Object.values(this.locationIdToLocation).sort((locationA, locationB) => {
        let aScene1 = this.locationIdToScenes[locationA.id][0];
        let bScene1 = this.locationIdToScenes[locationB.id][0];
        return sceneIdToOrderIndex[aScene1.id] - sceneIdToOrderIndex[bScene1.id];
      });
      for (const [index, location] of this.locations.entries()) {
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

        const approvalStatusColors = this.getApprovalStatusPinColor(locationOption);
        locationOption.addressCoordinates = coordinates;
        locationOption.addressPin = new google.maps.marker.PinElement({
          scale: 1,
          glyphText: String(locationIndex + 1),
          background: approvalStatusColors[0],
          borderColor: approvalStatusColors[1],
          glyphColor: approvalStatusColors[1],
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

  getApprovalStatusPinColor(option: LocationOption): string[] {
    switch (option.approvalStatus) {
      case LocationOptionApprovalStatus.NOT_APPLICABLE:
      case LocationOptionApprovalStatus.APPROVED:
        if (option.isChosen) {
          return ["limegreen", "white"];
        }
        return ["green", "white"];
      case LocationOptionApprovalStatus.PENDING_APPROVAL:
        return ["yellow", "black"];
      case LocationOptionApprovalStatus.NOT_APPROVED:
        return ["red", "white"];
      default:
        return ["purple", "white"];
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

  getScenes(locationId: number): Scene[] {
    return this.locationIdToScenes[locationId];
  }

  onLocationClick(event: any): void {
    this.selectedLocationIndex = event['locationIndex'];
    this.selectedLocation = event['location'];
    this.selectedLocationOption = event['locationOption'];
    if (this.selectedLocationOption) {
      this.loadImages(this.selectedLocationOption);
    }
  }

  private loadImages(locationOption: LocationOption): void {
    this.loadingImages = true;
    let folder = locationOption.folder;
    this.googleService.listFiles(folder.id)
      .subscribe({
        next: (files) => {
          console.log("Found files", files);
          if (files.length === 0) {
            this.loadingImages = false;
            return;
          }

          const imageObservables: Observable<LocationOptionImage>[] = files.map(file => {
            return this.googleService.loadImage(file);
          });

          forkJoin(imageObservables)
            .subscribe({
              next: (images: LocationOptionImage[]) => {
                let verticalImages = images.filter(image => image.file.imageMetadata?.displayDirection === ImageDisplayDirection.VERTICAL);
                let horizontalImages = images.filter(image => image.file.imageMetadata?.displayDirection !== ImageDisplayDirection.VERTICAL);
                locationOption.verticalImages = verticalImages;
                locationOption.horizontalImages = horizontalImages;

                this.loadingImages = false;
              },
              error: (error) => this.handleError(error)
            });
        },
        error: (error) => this.handleError(error)
      });
  }
}
