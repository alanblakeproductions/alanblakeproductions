import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address, Highlight, Person, Project, ProjectType, ProjectSubType, Showtime } from './../util/models'

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.less'
})
export class ProjectsComponent {

  EXAMPLE_PHOTO: string = "https://picsum.photos/id/120/1200/800";
  matchingProjects: Project[] = []

  constructor() {
    this.matchingProjects.push({
      title: "Love Me (K)not",
      description: "Distraught by dating woes, Chicago 30-somethings Jesse and Alice reluctantly enter the realm of "
        + "online dating with the often misguided help of friends and acquaintances.",
      type: ProjectType.Screen,
      subtype: ProjectSubType.TV,
      startYear: "2023",
      endYear: undefined,
      image: "assets/images/love_me_knot_2.png",
      youtube: "https://youtu.be/FoFsBxUdduY",
      website: undefined,
      roles: [
        "Cinematographer",
        "Co-Director",
        "Writer",
        "Editor",
      ],
      highlights: [
      ],
    })

    this.matchingProjects.push({
      title: "Comet",
      description: "15 years after a comet threatens extinction on Earth, one of the astronomers who discovered it "
      + "recounts the story to her niece.",
      type: ProjectType.Stage,
      subtype: ProjectSubType.Play,
      startYear: "2024",
      endYear: undefined,
      image: this.EXAMPLE_PHOTO,
      website: "https://alanblakeproductions.github.io/cometproduction/home",
      youtube: undefined,
      roles: [
        "Writer",
      ],
      highlights: [
        {
          title: "Chicago Rhinofest 2024",
          description: "Produced and staged for a 4-show run",
        },
      ],
    })

    this.matchingProjects.push({
      title: "I-80: An Interstate Crime Story",
      description: "A bumbling brother and sister seek petty revenge against a freight shipping magnate, drawing the "
      + "attention of a traveling gun-for-hire seeking to escape her world of violence. When she seizes an opportunity "
      + "to do so, a series of misunderstandings bring mayhem to a quiet Iowa city.",
      type: ProjectType.Screen,
      subtype: ProjectSubType.TV,
      startYear: "2023",
      endYear: "2023",
      image: this.EXAMPLE_PHOTO,
      website: undefined,
      youtube: undefined,
      roles: [
        "Writer",
      ],
      highlights: [
        {
          title: "Cinequest Screenwriting Competition 2023-2024",
          description: "Semifinalist",
        },
        {
          title: "The Southern California Screenplay Competition 2023",
          description: "Quarterfinalist",
        },
        {
          title: "The Finish Line Script Competition 2022-2023",
          description: "Honorable Mention",
        }
      ],
    })

    this.matchingProjects.push({
      title: "Diner",
      description: "On a single night, a tentative man is wrangled into taking a role in blackmail negotiations "
        + "between a duo of inept criminals and a flighty small-time politician.",
      type: ProjectType.Screen,
      subtype: ProjectSubType.Feature,
      startYear: "2024",
      endYear: "2024",
      image: this.EXAMPLE_PHOTO,
      website: undefined,
      youtube: undefined,
      roles: [
        "Writer",
      ],
      highlights: [
      ],
    })

    this.matchingProjects.push({
      title: "The Shearing",
      description: "A revisionist retelling of the Silence of the Lambs in musical form.",
      type: ProjectType.Stage,
      subtype: ProjectSubType.Musical,
      startYear: "2020",
      endYear: "2022",
      image: this.EXAMPLE_PHOTO,
      website: undefined,
      youtube: undefined,
      roles: [
        "Writer",
      ],
      highlights: [
      ],
    })
  }

  returnZero() {
    return 0;
  }
}
