import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Location, LocationOption, ShotmakerProject } from './../util/models';
import { GoogleDriveService } from './../service/google-drive.service';
import { GoogleDriveFile, LocationOptionDetail } from './../util/models';
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
  @Input() location$: Subject<Location> = new Subject();
  @Input() locationOptions$: Subject<Record<number, LocationOption>> = new Subject();
  @Input() locationOptionFolders$: Subject<Record<number, GoogleDriveFile>> = new Subject();

  location: Location | undefined = undefined;
  locationOptionDetails: Record<number, LocationOptionDetail> = {};
  loadingImages: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private googleService: GoogleDriveService,
  ) {}

  ngOnInit(): void {
    this.location$.subscribe(location => {
      this.locationOptions$.subscribe((locationOptions: Record<number, LocationOption>) => {
        this.locationOptionFolders$.subscribe((locationOptionFolders: Record<number, GoogleDriveFile>) => {
          this.loadingImages = true;

          this.location = location;

          Object.entries(locationOptionFolders).forEach(([optionId, folder]) => {
            let option = locationOptions[Number(optionId)];
            if (option) {
              this.locationOptionDetails[Number(optionId)] = {
                option: option,
                folder: folder,
                folderUrl: `https://drive.google.com/drive/u/1/folders/${folder.id}`,
                images: [],
                imageUrls: []
              };
            }
          });

          Object.entries(locationOptionFolders).forEach(([optionId, folder]) => {
            this.loadImages(folder);
          });
        });
      });
    });
  }

  private loadImages(folder: GoogleDriveFile): void {
    this.googleService.listFiles(folder.id).subscribe((files) => {
      const imageUrlObservables: Observable<string>[] = files.map(file => {
        return this.googleService.loadImageUrl(file);
      });

      forkJoin(imageUrlObservables).subscribe((imageUrls: string[]) => {
        this.locationOptionDetails[Number(folder.name)].imageUrls = imageUrls;

        this.loadingImages = false;
      });
    });
  }
}
