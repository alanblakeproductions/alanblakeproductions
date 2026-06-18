export interface GoogleDriveFile {
  id: string,
  name: string,
  mimeType: string,
  imageMetadata: ImageMetadata | undefined
}

export interface ImageMetadata {
  displayDirection: ImageDisplayDirection,
  fullHeight: number,
  fullWidth: number,
  smallHeight: number,
  smallWidth: number,
}

export enum ImageDisplayDirection {
  HORIZONTAL = "HORIZONTAL",
  VERTICAL = "VERTICAL",
}
