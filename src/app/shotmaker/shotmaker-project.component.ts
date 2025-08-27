import { Component, HostListener, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ShotmakerProject, ShotmakerProjectSummary, ShotmakerProjectShotlist, ShotmakerProjectVideo, Shadow, Shot } from './../util/models'
import { switchMap } from 'rxjs/operators';
//import * as fs from 'fs';

@Component({
  selector: 'app-shotmaker-project',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './shotmaker-project.component.html',
  styleUrl: './shotmaker-project.component.less'
})
export class ShotmakerProjectComponent implements OnInit {

  shotmakerProjects: Record<string, ShotmakerProject> = {
    "colorblind": {
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
        link: "assets/shotmaker/colorblind-demo-v3.mov",
      }
    }
  };

  activeProjectId: string = "colorblind";
  activeProject: ShotmakerProject = this.shotmakerProjects[this.activeProjectId];
  activeProjectShots: Shot[] = [];
  activeProjectShadows: Shadow[] = [];
  activeTab: string = "shotlist";

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    let params = this.route.snapshot.paramMap;
    this.activeProjectId = params.get('projectId') ?? "colorblind";
    this.activeTab = params.get('tab') ?? "shotlist";

    this.activeProject = this.shotmakerProjects[this.activeProjectId];

    const shotlistCsvFilePath = this.activeProject.shotlist.file;
    this.http.get(shotlistCsvFilePath, { responseType: 'text'}).subscribe(csvFileContents => {
      let rows = csvFileContents.split("\n");
      let headers = rows[0].split("\t");
      let headerToIndex: Record<string, number> = {};
      for (var i = 0; i < headers.length; i++) {
        headerToIndex[headers[i]] = i;
      }

      for (var i = 1; i < rows.length; i++) {
        let row = rows[i];
        let cells = row.split("\t");
        let scene = cells[headerToIndex["SCENE #"]];
        let setup = cells[headerToIndex["SETUP #"]];
        let shotId = cells[headerToIndex["SHOT #"]];
        let subject = cells[headerToIndex["SUBJECT"]];
        let shotSize = cells[headerToIndex["SHOT SIZE"]];
        let camera = cells[headerToIndex["CAMERA"]];
        let angle = cells[headerToIndex["ANGLE"]];
        let movement = cells[headerToIndex["MOVEMENT"]];
        let lens = cells[headerToIndex["LENS"]];
        let notes = cells[headerToIndex["NOTES"]];
        let priority = cells[headerToIndex["PRIORITY"]];
        this.activeProjectShots.push({
          scene: scene,
          setup: setup,
          shotId: shotId,
          subject: subject,
          shotSize: shotSize,
          camera: camera,
          angle: angle,
          movement: movement,
          lens: lens,
          notes: notes,
          priority: priority,
          imageLink: "assets/" + this.activeProjectId + "/shots/" + this.activeProjectId + "-scene-" + scene + "-" + setup + shotId + ".png",
          scriptLink: "",
        });
      }
    });

    const shadowsCsvFilePath = this.activeProject.shadows.file;
    this.http.get(shadowsCsvFilePath, { responseType: 'text'}).subscribe(csvFileContents => {
      let rows = csvFileContents.split("\n");
      let headers = rows[0].split("\t");
      let headerToIndex: Record<string, number> = {};
      for (var i = 0; i < headers.length; i++) {
        headerToIndex[headers[i]] = i;
      }

      for (var i = 1; i < rows.length; i++) {
        let row = rows[i];
        let cells = row.split("\t");
        let time = cells[headerToIndex["TIME"]];
        this.activeProjectShadows.push({
          time: time,
          imageLink: "assets/" + this.activeProjectId + "/shadows/" + this.activeProjectId + "-shadow-" + time.replace(":", "") + ".png",
        });
      }
    });
  }
}
