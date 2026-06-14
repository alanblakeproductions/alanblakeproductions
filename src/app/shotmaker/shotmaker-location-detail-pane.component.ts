import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Location, LocationOption, ShotmakerProject } from './../util/models';
import { GoogleDriveService } from './../service/google-drive.service';
import { GoogleDriveFile } from './../util/models';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';

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
  @Input() locationOptions$: Subject<LocationOption[]> = new Subject();

  @Input() locationOptionFolder$: Subject<GoogleDriveFile> = new Subject();
  @Input() locationOption$: Subject<LocationOption> = new Subject();

  location: Location | undefined = undefined;
  locationOptionFolder: GoogleDriveFile | undefined = undefined;
  locationOptionFiles: Record<string, GoogleDriveFile> = {};
  loadingLocationOptionFiles: boolean = true;
  locationOptions: LocationOption[] | undefined = undefined;
  locationOption: LocationOption | undefined = undefined;

  projectId: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private googleService: GoogleDriveService,
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? "";

    this.location$.subscribe(location => {
      if (location) {
        this.location = location;
      }
    });

    this.locationOptions$.subscribe(locationOptions => {
      if (locationOptions) {
        this.locationOptions = locationOptions;
      }
    });

    this.locationOption$.subscribe(locationOption => {
      if (locationOption) {
        this.locationOption = locationOption;
      }
    });

    this.locationOptionFolder$.subscribe(locationOptionFolder => {
    console.log("locationOptionFolder", locationOptionFolder);
      if (locationOptionFolder) {
        this.locationOptionFolder = locationOptionFolder;
        this.locationOptionFiles = {};
        this.loadingLocationOptionFiles = true;
        this.googleService.listFiles(locationOptionFolder.id).subscribe((files) => {
          for (let file of files) {
            this.googleService.loadImageUrl(file).subscribe((url) => {
              this.locationOptionFiles[url] = file;
              this.loadingLocationOptionFiles = false;
            });
          }
        });
      }
    });
  }

  getFolderLink(): string {
    let folderId = this.locationOptionFolder?.id;
    return `https://drive.google.com/drive/u/1/folders/${folderId}`;
  }
}
