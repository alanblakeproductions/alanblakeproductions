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
  type: ProjectType,
  subtype: ProjectSubType,
  description: string,
  startYear: number,
  endYear: number | undefined,
  roles: string[],
  image: string,
  youtube: string | undefined,
  website: string | undefined,
  highlights: Highlight[],
}

export interface Highlight {
  title: string,
  description: string
}

export enum ProjectType {
  Stage,
  Screen,
}

export enum ProjectSubType {
   Play,
   Musical,
   TV,
   Feature,
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
