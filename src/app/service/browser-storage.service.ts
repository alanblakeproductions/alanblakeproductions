import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {

  constructor() {}

  // Set a value in local storage
  private setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // Get a value from local storage
  private getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Remove a value from local storage
  private removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all items from local storage
  private clear(regex: RegExp): void {
    const keysToRemove: string[] = [];

    // Iterate over localStorage and collect keys matching the regex
    for (let i = 0; i < localStorage.length; i++) {
      const key: string | null = localStorage.key(i);
      if (key && regex.test(key)) {
        keysToRemove.push(key);
      }
    }

    // Remove the collected items
    for (const key of keysToRemove) {
      console.log("Clearing key", key);
      this.removeItem(key);
    }
  }

  private getGoogleAccessTokenKey(): string {
    return "shotmaker.access-token";
  }

  getGoogleAccessToken(): string | null {
    return this.getItem(this.getGoogleAccessTokenKey());
  }

  setGoogleAccessToken(token: string): void {
    this.setItem(this.getGoogleAccessTokenKey(), token);
  }

  clearGoogleAccessToken(): void {
    this.removeItem(this.getGoogleAccessTokenKey());
  }

  getGoogleAccessTokenExpirationKey(): string {
    return "shotmaker.access-token.expiration";
  }

  getGoogleAccessTokenExpiration(): number {
    let expiration = this.getItem(this.getGoogleAccessTokenExpirationKey());
    if (expiration) {
      return Number(expiration);
    }
    return 0;
  }

  setGoogleAccessTokenExpiration(expiration: number): void {
    this.setItem(this.getGoogleAccessTokenExpirationKey(), String(expiration));
  }

  clearGoogleAccessTokenExpiration(): void {
    this.removeItem(this.getGoogleAccessTokenExpirationKey());
  }

  private getShotStatusKey(projectId: string, shotId: number): string {
    return "shotmaker.project-" + projectId + ".shot-" + shotId + ".status";
  }

  getShotStatus(projectId: string, shotId: number): string {
    return this.getItem(this.getShotStatusKey(projectId, shotId)) ?? "todo";
  }

  setShotStatus(projectId: string, shotId: number, status: string): void {
    this.setItem(this.getShotStatusKey(projectId, shotId), status);
  }

  private getShotOrderKeyRegex(projectId: string) {
    return new RegExp("shotmaker\.project-" + projectId + "\.status-.*\.shot-.*\.order");
  }

  private getShotOrderKey(projectId: string, status: string, shotId: number): string {
    return "shotmaker.project-" + projectId + ".status-" + status + ".shot-" + shotId + ".order";
  }

  getShotOrder(projectId: string, status: string, shotId: number): number {
    return Number(this.getItem(this.getShotOrderKey(projectId, status, shotId)) ?? "1000");
  }

  setShotOrder(projectId: string, status: string, shotId: number, order: number): void {
    this.setItem(this.getShotOrderKey(projectId, status, shotId), "" + order);
  }

  clearShotOrder(projectId: string): void {
    this.clear(this.getShotOrderKeyRegex(projectId));
  }

  private getLocationCoordinatesKey(address: string) {
    return `shotmaker.address-${address}`;
  }

  getLocationCoordinates(address: string): google.maps.LatLngLiteral | undefined {
    let value = this.getItem(this.getLocationCoordinatesKey(address));
    if (value) {
      return {
        lat: Number(value.split(":")[0]),
        lng: Number(value.split(":")[1])
      }
    }
    return undefined;
  }

  setLocationCoordinates(address: string, locationCoordinates: google.maps.LatLngLiteral): void {
    this.setItem(this.getLocationCoordinatesKey(address), `${locationCoordinates.lat}:${locationCoordinates.lng}`);
  }
}
