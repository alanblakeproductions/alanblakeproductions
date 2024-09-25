import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Address, Highlight, Person, Project, ProjectType, ProjectSubType, Showtime } from './../util/models'

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.less'
})
export class ProjectsComponent {

  EXAMPLE_PHOTO: string = "https://picsum.photos/id/120/1200/800";
  matchingProjects: Project[] = []

/*
  @HostListener("window:keydown", ["$event"])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == 39) {
      // right
      console.log("right")
    }
    else if (event.keyCode == 37) {
      // left
      console.log("left")
    }
  }

  */



  constructor() {
    this.matchingProjects.push({
      title: "Sedgwick",
      description: "A malevalent ghoul walks the streets of Chicago, embedding itself in the city inhabitants' lives. "
        + "For some, it inspires fear; for others, its predictable and violent nature presents opportunity.",
      type: ProjectType.Screen,
      subtype: ProjectSubType.TV,
      startYear: 2024,
      endYear: undefined,
      image: "assets/images/sedgwick/sedgwick_header.jpg",
      image_attribution: undefined,
      coverfly: undefined,
      youtube: undefined,
      website: "sedgwick",
      roles: [
        "Writer",
      ],
      highlights: [
      ],
    })

    this.matchingProjects.push({
      title: "Love Me (K)not",
      description: "Distraught by dating woes, Chicago 30-somethings Jesse and Alice reluctantly enter the realm of "
        + "online dating with the often misguided help of friends and acquaintances.",
      type: ProjectType.Screen,
      subtype: ProjectSubType.TV,
      startYear: 2023,
      endYear: undefined,
      image: "assets/images/love_me_knot.png",
      image_attribution: undefined,
      coverfly: undefined,
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
      startYear: 2024,
      endYear: 2024,
      image: "assets/images/comet_1.jpg",
      image_attribution: undefined,
      coverfly: "https://writers.coverfly.com/projects/view/ba67d38c-3bb0-4634-bc40-e48eb8c5ec19/The_Comet",
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
        {
          title: "Richmond International Film Festival Screenplay Competition",
          description: "Semifinalist",
        },
        {
          title: "Creative World Awards",
          description: "Quarterfinalist",
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
      startYear: 2023,
      endYear: 2023,
      image: "assets/images/i_80.png",
      image_attribution: "Jahongir Ismoilov",
      coverfly: "https://writers.coverfly.com/projects/view/787e13f5-aa82-473b-9e40-8c78197e5a23/I80_An_Interstate_Crime_Story",
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
      startYear: 2024,
      endYear: 2024,
      image: "assets/images/diner.png",
      image_attribution: "Lee Cartledge",
      coverfly: "https://writers.coverfly.com/projects/view/bf5d8da6-e4f6-4ec8-b47d-ec2388a8b723/Diner",
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
      startYear: 2020,
      endYear: 2022,
      image: "assets/images/shearing.png",
      image_attribution: "Image by pikisuperstar on Freepik",
      coverfly: undefined,
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

  getId(project: Project) {
    return project.title.replaceAll(/[^a-zA-Z0-9]/g, "-")
  }

  getNextId(index: number) {
    if (index == this.matchingProjects.length - 1) {
      return this.getId(this.matchingProjects[0]);
    }
    return this.getId(this.matchingProjects[index + 1])
  }

  getPreviousId(index: number) {
    if (index == 0) {
      return this.getId(this.matchingProjects[this.matchingProjects.length - 1]);
    }
    return this.getId(this.matchingProjects[index - 1])
  }

  onKeyPress($event: any, index: number) {
    console.log($event.keyCode)
  }
}
