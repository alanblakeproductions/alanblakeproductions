// Database entities
import { GoogleDriveFile } from './google-models';

export interface SceneEntity {
  id: string,
  status: string,
  setting: string,
  description: string,
  timeOfDay: string,
  notes: string[],
  filmDay: string,
  locationId: number
}

export interface LocationEntity {
  id: number,
  name: string,
  notes: string[],
}

export interface LocationOptionEntity {
  id: number,
  locationId: number,
  description: string,
  address: string,
  notes: string[],
  approvalStatus: string,
  contacts: Contact[],
}

export interface Scene {
  id: string,
  status: string,
  setting: string,
  description: string,
  timeOfDay: string,
  notes: string[],
  filmDay: string,
  location: Location,
  warnings: string[],
  childWarnings: string[],
}

export interface Location {
  id: number,
  name: string,
  notes: string[],
  sceneIds: string[],
  warnings: string[],
  locationOptions: LocationOption[],
}

export interface LocationOption {
  id: number,
  description: string,
  address: string,
  addressCoordinates: google.maps.LatLngLiteral | undefined,
  addressPin: google.maps.marker.PinElement | Node | undefined,
  notes: string[],
  approvalStatus: LocationOptionApprovalStatus,
  contacts: Contact[],
  warnings: string[],
  folder: GoogleDriveFile,
  folderUrl: string,
  horizontalImages: LocationOptionImage[],
  verticalImages: LocationOptionImage[],
}

export enum LocationOptionApprovalStatus {
  NOT_APPLICABLE = "N/A",
  APPROVED = "APPROVED",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  NOT_APPROVED = "NOT_APPROVED"
}

export interface Contact {
  name: string,
  email: string,
  phone: string,
}

export interface LocationOptionImage {
  file: GoogleDriveFile,
  url: string,
}

export interface FilmDay {
  date: string,
  scenes: Scene[],
  warnings: string[],
  childWarnings: string[],
}
