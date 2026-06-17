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
  locationOptions: LocationOption[],
  warnings: string[],
  childWarnings: string[],
}

export interface Location {
  id: number,
  name: string,
  notes: string[],
  sceneIds: string[],
  warnings: string[],
}

export interface LocationOption {
  id: number,
  description: string,
  address: string,
  notes: string[],
  approvalStatus: LocationOptionApprovalStatus,
  contacts: Contact[],
  warnings: string[],
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

export interface LocationOptionDetail {
  option: LocationOption,
  folder: GoogleDriveFile,
  folderUrl: string,
  images: LocationOptionImage[],
}

export interface LocationOptionImage {
  file: GoogleDriveFile,
  url: string,
}
