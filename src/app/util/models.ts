export interface Address {
  name: string,
  line1: string,
  line2: string | undefined,
  city: string,
  state: string,
  zip: string,
  image: string,
  link: string,
}

export interface Person {
  firstName: string,
  lastName: string,
  roles: string[],
  image: string
}

export interface Project {
  title: string,
  type: string,
  genre: string,
  description: string,
  startYear: number,
  endYear: number | undefined,
  roles: string[],
  image: string,
  image_attribution: string | undefined,
  youtube: string | undefined,
  website: string | undefined,
  coverfly: string | undefined,
  highlights: Highlight[],
}

export interface Highlight {
  title: string,
  description: string,
  image: string | undefined,
  laurel: string | undefined,
}

export interface Showrun {
  address: Address,
  ticketLink: string,
  showtimes: Showtime[],
}

export interface Showtime {
  date: Date,
  time: string,
}

export interface ShotmakerProjectSummary {
  title: string
}

export interface Shot {
  id: number,
  scene: string,
  setup: string,
  shotId: string,
  subject: string,
  shotSize: string,
  camera: string,
  angle: string,
  movement: string,
  lens: string,
  notes: string,
  pages: string,
  priority: string,
  mic: string,
  imageLink: string,
  shootTime: number,
}

export interface Shadow {
  time: string,
  imageLink: string,
}

export interface Location {
  id: number,
  scenes: number[],
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
  contactName: string,
  contactEmail: string,
  contactPhone: string,
}

export interface LocationOptionDetail {
  option: LocationOption,
  folder: GoogleDriveFile,
  folderUrl: string,
  images: GoogleDriveFile[],
  imageUrls: string[]
}

export interface ShotmakerProjectShotlist {
  file: string,
}

export interface ShotmakerProjectShadows {
  file: string,
}

export interface ShotmakerProjectVideo {
  link: string,
}

export interface ShotmakerProjectLocations {
  googleDriveFolderId: string,
  googleDriveLocationsUrl: string,
  googleDriveLocationOptionsUrl: string,
}

export interface ShotmakerProject {
  id: string,
  summary: ShotmakerProjectSummary,
  shotlist: ShotmakerProjectShotlist | undefined,
  shadows: ShotmakerProjectShadows | undefined,
  video: ShotmakerProjectVideo | undefined,
  locations: ShotmakerProjectLocations | undefined,
}

export interface GoogleDriveFile {
  id: string,
  name: string,
  mimeType: string,
}
