import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class LambdaService {
  constructor(private http: HttpClient) {}

  contact(model: any): Observable<{}> {
    var httpOptions = {
      headers: new HttpHeaders({}),
      params: new HttpParams()
        .set("name", model.name)
        .set("email", model.email)
        .set("comments", model.comments)
    }

    return this.http.get("https://4w3dv080h6.execute-api.us-west-2.amazonaws.com/production/contact", httpOptions)
    // return this.http.get("https://lambdas.alanbuttars.com/contact", httpOptions)
      .pipe(catchError(this.handleError));
  }

  breakRuzzle(grid: any): Observable<{}> {
    var specialCells: any = [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""]
    ];

    var httpOptions = {
      headers: new HttpHeaders({}),
      params: new HttpParams()
        .set("grid", grid)
        .set("specialCells", specialCells)
    }

    return this.http.get("https://4w3dv080h6.execute-api.us-west-2.amazonaws.com/production/break-ruzzle", httpOptions)
    // return this.http.get("https://lambdas.alanbuttars.com/contact", httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log("Error: ", error.error.message);
    }
    else {
      console.log("Error: ", error.status, error.error);
    }

    return throwError("An error occurred");
  }
}
