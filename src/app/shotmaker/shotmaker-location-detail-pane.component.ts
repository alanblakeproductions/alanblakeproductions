import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ShotmakerProject } from './../util/models';
import { Scene, Location, LocationEntity, LocationOption, LocationOptionEntity, LocationOptionDetail, LocationOptionImage, LocationOptionApprovalStatus } from './../util/shotmaker-location-models';
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
  @Input() scene$: Subject<Scene> = new Subject();
  @Input() locationOptionFolders$: Subject<Record<number, GoogleDriveFile>> = new Subject();

  scene: Scene | undefined = undefined;
  locationOptionDetails: Record<number, LocationOptionDetail> = {};
  loadingImages: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private googleService: GoogleDriveService,
  ) {}

  ngOnInit(): void {
    this.scene$.subscribe(scene => {
      this.scene = scene;

      let locationOptions = Object.fromEntries(scene.locationOptions.map(option => [option.id, option]));
      this.locationOptionFolders$.subscribe((locationOptionFolders: Record<number, GoogleDriveFile>) => {

        this.locationOptionDetails = {};
        this.loadingImages = true;

        Object.entries(locationOptionFolders).forEach(([optionId, folder]) => {
          let option = locationOptions[Number(optionId)];
          if (option) {
            this.locationOptionDetails[Number(optionId)] = {
              option: option,
              folder: folder,
              folderUrl: `https://drive.google.com/drive/u/1/folders/${folder.id}`,
              horizontalImages: [],
              verticalImages: []
            };
          }
        });

        Object.entries(locationOptionFolders).forEach(([optionId, folder]) => {
          this.loadImages(folder);
        });
      });
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

  private loadImages(folder: GoogleDriveFile): void {
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
                this.locationOptionDetails[Number(folder.name)].verticalImages = verticalImages;
                this.locationOptionDetails[Number(folder.name)].horizontalImages = horizontalImages;

                this.loadingImages = false;
              },
              error: (error) => this.handleError(error)
            });
        },
        error: (error) => this.handleError(error)
      });
  }

  getOptionTitle(detail: LocationOptionDetail): string {
    if (detail.option.description) {
      return detail.option.description;
    }

    if (detail.option.address) {
      return detail.option.address;
    }

    return `Option ${detail.option.id}`;
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
