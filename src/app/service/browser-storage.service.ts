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
  private clear(): void {
    localStorage.clear();
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
}
