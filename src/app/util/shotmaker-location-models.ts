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
  location: Location2,
  locationOptions: LocationOption2[],
  warnings: string[],
  childWarnings: string[],
}

export interface Location2 {
  id: number,
  name: string,
  notes: string[],
  sceneIds: string[],
  warnings: string[],
}

export interface LocationOption2 {
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

export interface Location {
  id: number,
  scenes: string[],
  intExt: string,
  timeOfDay: string,
  description: string,
  notes: string,
}

export interface LocationOption {
  id: number,
  locationId: number,
  description: string,
  address: string,
  notes: string,
  contacts: Contact[],
}

export interface Contact {
  name: string,
  email: string,
  phone: string,
}

export interface LocationOptionDetail {
  option: LocationOption2,
  folder: GoogleDriveFile,
  folderUrl: string,
  images: LocationOptionImage[],
}

export interface LocationOptionImage {
  file: GoogleDriveFile,
  url: string,
}
