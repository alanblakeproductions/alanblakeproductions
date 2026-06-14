import { Component, HostListener, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ShotmakerLocationsComponent } from './shotmaker-locations.component';
import { ShotmakerShadowsComponent } from './shotmaker-shadows.component';
import { ShotmakerShotlistComponent } from './shotmaker-shotlist.component';
import { ShotmakerProject } from './../util/models';
import { BrowserStorageService } from './../service/browser-storage.service';
import { GoogleDriveService } from './../service/google-drive.service';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { map, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-shotmaker-project',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    ShotmakerLocationsComponent,
    ShotmakerShadowsComponent,
    ShotmakerShotlistComponent,
  ],
  templateUrl: './shotmaker-project.component.html',
  styleUrl: './shotmaker-project.component.less'
})
export class ShotmakerProjectComponent implements OnInit {

  SHOTMAKER_PROJECTS: Record<string, ShotmakerProject> = {
    "ballad-of-the-night-owl": {
      id: "ballad-of-the-night-owl",
      summary: {
        title: "Ballad of the Night Owl",
      },
      shotlist: undefined,
      shadows: undefined,
      video: undefined,
      locations: {
        googleDriveFolderId: "1d20CsOIaQqeJh-GZnLLub08OJnrOh9ZO",
        googleDriveLocationsUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4b9qDkAnSYCoiOtpkEC9xKL6OvtDCfRmXe2a-GZqAM9NngFwrGe_aPVNlD8aWzh1oho2odaQ_szmE/pub?gid=0&single=true&output=tsv",
        googleDriveLocationOptionsUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4b9qDkAnSYCoiOtpkEC9xKL6OvtDCfRmXe2a-GZqAM9NngFwrGe_aPVNlD8aWzh1oho2odaQ_szmE/pub?gid=649795268&single=true&output=tsv"
      },
    },
    "colorblind": {
      id: "colorblind",
      summary: {
        title: "Colorblind",
      },
      shotlist: {
        file: "assets/shotmaker/colorblind.shotlist.csv",
      },
      shadows: {
        file: "assets/shotmaker/colorblind.shadows.csv",
      },
      video: {
        link: "assets/shotmaker/colorblind-demo-v4.mov",
      },
      locations: undefined,
    },
    "love-me-knot-ep-5": {
       id: "love-me-knot-ep-5",
       summary: {
         title: "Love Me (K)not: Episode 5",
       },
       shotlist: {
         file: "assets/shotmaker/love-me-knot-ep-5.shotlist.csv",
       },
       shadows: undefined,
       video: undefined,
       locations: undefined,
    },
    "love-me-knot-ep-6": {
       id: "love-me-knot-ep-6",
       summary: {
         title: "Love Me (K)not: Episode 6",
       },
       shotlist: {
         file: "assets/shotmaker/love-me-knot-ep-6.shotlist.csv",
       },
       shadows: undefined,
       video: undefined,
       locations: undefined,
    }
  };

  project: ShotmakerProject = {} as ShotmakerProject;
  isLoggedIn: boolean = false;

  constructor(
    private googleService: GoogleDriveService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private browserStorageService: BrowserStorageService
  ) {
  }

  ngOnInit(): void {
    this.googleService.getAuthStatus().subscribe((authStatus) => {
      this.onAuthStatusChange(authStatus);
    });

    this.route.params.pipe(map(params => params['projectId']), distinctUntilChanged()).subscribe(projectId => {
      this.project = this.SHOTMAKER_PROJECTS[projectId];
    });

    var googleAccessToken = this.browserStorageService.getGoogleAccessToken();
    if (googleAccessToken) {
      this.onAuthStatusChange(true);
    }
  }

  onAuthStatusChange(isLoggedIn: boolean): void {
    this.isLoggedIn = isLoggedIn;
  }

  login(): void {
    this.googleService.login();
  }

  logout(): void {
    this.googleService.logout();
  }
}
