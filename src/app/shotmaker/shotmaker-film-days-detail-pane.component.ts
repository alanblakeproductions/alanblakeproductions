import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ShotmakerProject } from './../util/models';
import { FilmDay, Location, LocationEntity, LocationOption, LocationOptionImage, LocationOptionApprovalStatus } from './../util/shotmaker-location-models';
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
  ],
  templateUrl: './shotmaker-film-days-detail-pane.component.html',
  styleUrl: './shotmaker-film-days-detail-pane.component.less'
})
export class ShotmakerFilmDaysDetailPane implements OnInit {

  @Input() project: ShotmakerProject = {} as ShotmakerProject;
  @Input() filmDay$: Subject<FilmDay> = new Subject();

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
  loadingImages: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private googleService: GoogleDriveService,
  ) {}

  ngOnInit(): void {
    this.filmDay$.subscribe(filmDay => {
      this.filmDay = filmDay;
      this.loadingImages = true;

      const sceneIdsToLocationOption: Record<string, LocationOption> = {};
      for (let scene of filmDay.scenes) {
        let sceneIdsKey = scene.location.sceneIds.join(", ")
        for (let locationOption of scene.locationOptions) {
          sceneIdsToLocationOption[sceneIdsKey] = locationOption;
        }
      }

      for (let [sceneIds, locationOption] of Object.entries(sceneIdsToLocationOption) as [string, LocationOption][]) {
        this.loadLocation(sceneIds, locationOption);
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

  private loadLocation(sceneIds: string, locationOption: LocationOption): void {
    if (!locationOption.address) {
      console.error(`No address for location option ${locationOption.id}`);
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
          glyphText: sceneIds,
          scale: 2,
        });
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
}
