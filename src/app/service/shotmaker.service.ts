import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of} from 'rxjs';
import { SceneEntity } from './../util/shotmaker-location-models';
import { map } from 'rxjs/operators';

declare const google: any; // Declares the GIS SDK global variable

@Injectable({
  providedIn: 'root'
})
export class ShotmakerService {

  constructor(private http: HttpClient) {
  }

  public fetchSceneEntities(googleDriveScenesUrl: string): Promise<SceneEntity[]> {
    return fetch(googleDriveScenesUrl)
      .then((response) => response.text())
      .then((data) => {
        let rows = data.trim().split("\n");
        let headers = rows[0].split("\t");
        let headerToIndex: Record<string, number> = {};
        for (var i = 0; i < headers.length; i++) {
          headerToIndex[headers[i].trim()] = i;
        }

        let scenes: SceneEntity[] = [];
        for (var i = 1; i < rows.length; i++) {
          let row = rows[i];
          let cells = row.trim().split("\t").map(val => val.trim());
          let status = cells[headerToIndex["Status"]];
          if (status === "CUT" || status === "TITLE CARD") {
            continue;
          }

          let id = cells[headerToIndex["Scene ID"]];
          let setting = cells[headerToIndex["Setting"]];
          let description = cells[headerToIndex["Description"]];
          let timeOfDay = cells[headerToIndex["Time Of Day"]];
          let notes = (cells[headerToIndex["Notes"]] ?? "").split("  ");
          let filmDay = cells[headerToIndex["Film Day"]];
          let locationId = Number(cells[headerToIndex["Location ID"]]);

          scenes.push({
            id: id,
            status: status,
            setting: setting,
            description: description,
            timeOfDay: timeOfDay,
            notes: notes,
            locationId: locationId,
          });
        }

        return scenes;
      });
  }
}
