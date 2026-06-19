import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GoogleMap } from '@angular/google-maps';
import { Observable, Subject } from 'rxjs';
import { BrowserStorageService } from './browser-storage.service';
import { GoogleDriveFile, ImageMetadata, ImageDisplayDirection } from './../util/google-models';
import { LocationOptionImage } from './../util/shotmaker-location-models';
import { map } from 'rxjs/operators';

declare const google: any; // Declares the GIS SDK global variable

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {

  private readonly CLIENT_ID = '508987750835-k2slqr9rk4uik5o821c34s21ra4e7nv9.apps.googleusercontent.com';
  private readonly DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  private readonly SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata.readonly';

  private tokenClient: any;
  private geocoder: google.maps.GeocodingLibrary;
  private authStatus$ = new Subject<boolean>();

  constructor(private http: HttpClient,
              private browserStorageService: BrowserStorageService) {
    this.initTokenClient();
    this.geocoder = google.maps.importLibrary('geocoding');
    google.maps.importLibrary('marker');
  }

  // Initialize the OAuth client
  private initTokenClient() {
    // Wait for the script to load if necessary
    setTimeout(() => {
      if (typeof google !== 'undefined') {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: this.CLIENT_ID,
          scope: this.SCOPES,
          callback: (response: any) => {
            if (response.error !== undefined) {
              throw response;
            }
            this.browserStorageService.setGoogleAccessToken(response.access_token);
            this.browserStorageService.setGoogleAccessTokenExpiration(Date.now() + (response.expires_in * 1000));
            this.authStatus$.next(true);
          },
        });
      }
    }, 1000);
  }

  // Trigger OAuth login popup
  public login() {
    if (this.tokenClient) {
      // Prompt user to select account and grant permissions
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  }

  private tickleAccessToken() {
    if (this.tokenClient) {
      const expiresAt = this.browserStorageService.getGoogleAccessTokenExpiration();
      if (Date.now() > expiresAt - 5 * 60 * 1000) {
        console.log("Tickling access token");
        this.tokenClient.requestAccessToken({ prompt: 'none' });
      }
    }
  }

  public logout() {
    var accessToken = this.browserStorageService.getGoogleAccessToken();
    this.browserStorageService.clearGoogleAccessToken();
    this.browserStorageService.clearGoogleAccessTokenExpiration();
    if (typeof google !== "undefined") {
      google.accounts.oauth2.revoke(accessToken, () => {
        this.authStatus$.next(false);
      });
    }
    else {
      this.authStatus$.next(false);
    }
  }

  public getAuthStatus(): Observable<boolean> {
    this.tickleAccessToken();
    return this.authStatus$.asObservable();
  }

  public listFiles(folderId: string): Observable<GoogleDriveFile[]> {
    // Call the Google Drive v3 files endpoint
    this.tickleAccessToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.browserStorageService.getGoogleAccessToken()}`,
    });
    const params = {
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id,name,mimeType,imageMediaMetadata(height, width))'
    };
    return this.http.get<any>('https://www.googleapis.com/drive/v3/files', { headers, params })
      .pipe(map((response) => {
        return response.files.map((file: any) => {
          let imageMetadata = undefined;
          if (file.imageMediaMetadata?.width) {
            let imageDivisor = 1;
            if (file.imageMediaMetadata?.width > 5000) {
              imageDivisor = 6;
            }
            else if (file.imageMediaMetadata?.width > 2500) {
              imageDivisor = 4;
            }
            imageMetadata = {
              height: Number(file.imageMediaMetadata.height ?? 0),
              width: Number(file.imageMediaMetadata.width ?? 0),
              smallHeight: Number((file.imageMediaMetadata.height ?? 0) / imageDivisor),
              smallWidth: Number((file.imageMediaMetadata.width ?? 0) / imageDivisor),
              displayDirection: Number(file.imageMediaMetadata.height) > Number(file.imageMediaMetadata.width) ? ImageDisplayDirection.VERTICAL : ImageDisplayDirection.HORIZONTAL
            };
          }
          return {
            id: String(file.id),
            name: String(file.name),
            mimeType: String(file.mimeType),
            imageMetadata: imageMetadata,

          } as GoogleDriveFile;
        });
      }));
  }

  public loadImage(file: GoogleDriveFile): Observable<LocationOptionImage> {
    this.tickleAccessToken();
    const myHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.browserStorageService.getGoogleAccessToken()}`,
    });
    const params = {
      alt: 'media',
    };
    return this.http.get(`https://www.googleapis.com/drive/v3/files/${file.id}`,
      {
        headers: myHeaders,
        params: params,
        responseType: 'blob' as const
      })
      .pipe(map(blob => {
        return {
          file: file,
          url: URL.createObjectURL(blob)
        }
      }));
  }

  public createFolder(parentId: string, name: string): Observable<GoogleDriveFile> {
    this.tickleAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.browserStorageService.getGoogleAccessToken()}`,
    });
    const body = {
      name: name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    };
    return this.http.post<any>('https://www.googleapis.com/drive/v3/files',
      body,
      {
        headers,
      })
      .pipe(map((response) => {
        return {
          id: response.id,
          name: response.name,
          mimeType: response.mimeType,
          imageMetadata: undefined,
        };
      }));
  }

  public getLocationCoordinates(address: string): Promise<google.maps.LatLngLiteral> {
    let cachedLocationCoordinates = this.browserStorageService.getLocationCoordinates(address);
    if (cachedLocationCoordinates) {
      return Promise.resolve(cachedLocationCoordinates);
    }

    this.tickleAccessToken();
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: address }, (results: any, status: any) => {
        // Check if the request was successful and if results exist
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          const locationCoordinates = {
            lat: location.lat(),
            lng: location.lng()
          };
          console.log("Found ", address, locationCoordinates);

          // Extract lat and lng using the native methods
          this.browserStorageService.setLocationCoordinates(address, locationCoordinates);

          resolve(locationCoordinates);
        } else {
          this.browserStorageService.setLocationCoordinates(address, {
            lat: NaN,
            lng: NaN,
          });

          reject(new Error(`Geocoding failed for ${address}. Status: ${status}`));
        }
      });
    });
  }
}
