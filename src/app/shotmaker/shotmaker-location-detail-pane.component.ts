import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ShotmakerProject } from './../util/models';
import { Scene, Location, LocationEntity, LocationOption, LocationOptionEntity, LocationOptionImage, LocationOptionApprovalStatus } from './../util/shotmaker-location-models';
import { GoogleDriveService } from './../service/google-drive.service';
import { GoogleDriveFile, ImageDisplayDirection } from './../util/google-models';
import { Observable, Subject, BehaviorSubject, concat, of, forkJoin } from 'rxjs';
import { toArray } from 'rxjs/operators';

declare var UIkit: any;

@Component({
  selector: 'app-shotmaker-location-detail-pane',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './shotmaker-location-detail-pane.component.html',
  styleUrl: './shotmaker-location-detail-pane.component.less'
})
export class ShotmakerLocationDetailPane implements OnInit {

  @Input() project: ShotmakerProject = {} as ShotmakerProject;
  @Input() scene$: BehaviorSubject<Scene | undefined> = new BehaviorSubject<Scene | undefined>(undefined);

  scene: Scene | undefined = undefined;
  loadingImages: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private googleService: GoogleDriveService,
  ) {}

  ngOnInit(): void {
    this.scene$.subscribe(scene => {
      this.scene = scene;
      if (!this.scene) {
        return;
      }

      this.loadingImages = true;

      for (let locationOption of this.scene.location.locationOptions) {
        this.loadImages(locationOption);
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

  private loadImages(locationOption: LocationOption): void {
    let folder = locationOption.folder;
    this.googleService.listFiles(folder.id)
      .subscribe({
        next: (files) => {
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
