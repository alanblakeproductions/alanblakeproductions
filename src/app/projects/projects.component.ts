import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Address, Highlight, Person, Project, Showtime } from './../util/models'

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
      title: "Deepa",
      description: "A middle-aged South Asian wife and mother is jolted into digging around for deeper meaning in the stable container that is her family life.",
      type: "Short",
      genre: "Drama",
      startYear: 2025,
      endYear: 2025,
      image: "assets/images/deepa_open_1.png",
      image_attribution: undefined,
      coverfly: undefined,
      youtube: undefined,
      website: undefined,
      roles: [
        "Cinematographer",
        "Editor",
      ],
      highlights: [
      ],
    });

    this.matchingProjects.push({
      title: "Sedgwick",
      description: "A malevalent ghoul walks the streets of Chicago, embedding itself in the city inhabitants' lives. "
        + "For some, it inspires fear; for others, its predictable and violent nature presents opportunity.",
      type: "Episodic short series",
      genre: "Horror",
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
      title: "Immortal",
      description: "Dreading aging and death, a man takes severe measures to guarantee his immortality.",
      type: "Short",
      genre: "Horror",
      startYear: 2024,
      endYear: 2025,
      image: "assets/images/immortal.png",
      image_attribution: undefined,
      coverfly: undefined,
      youtube: undefined,
      website: undefined,
      roles: [
        "Writer",
        "Director",
        "Cinematographer",
        "Editor"
      ],
      highlights: [
        {
          title: "The Dunwich Horror Fest",
          description: "Finalist",
          image: "assets/images/the_dunwich_horror_fest_finalist_cthulhu_sign_black_transparent.png",
          laurel: "assets/images/laurel_finalist_white_transparent.png",
        },
        {
          title: "Loveland Shorts Film Festival",
          description: "Best Horror Short Finalist",
          image: "assets/images/2025_loveland_shorts_film_festival_best_horror_short_finalist.png",
          laurel: "assets/images/laurel_finalist_white_transparent.png",
        },
        {
          title: "Melrose Hill Short Film Festival",
          description: "Official Selection",
          image: "assets/images/2025_melrose_hill_short_film_festival_official_selection.png",
          laurel: "assets/images/laurel_official_selection_white_transparent.png",
        },
        {
          title: "Wreak Havoc Film Festival",
          description: "Official Selection",
          image: "assets/images/2025_wreak_havoc_film_festival_official_selection.png",
          laurel: "assets/images/laurel_official_selection_white_transparent.png",
        },
      ],
    })

    this.matchingProjects.push({
      title: "Love Me (K)not",
      description: "Distraught by dating woes, Chicago 30-somethings Jesse and Alice reluctantly enter the realm of "
        + "online dating with the often misguided help of friends and acquaintances.",
      type: "Web series",
      genre: "Rom-com",
      startYear: 2023,
      endYear: undefined,
      image: "assets/images/love_me_knot.png",
      image_attribution: undefined,
      coverfly: undefined,
      youtube: "https://www.youtube.com/watch?v=pyV2LYXo_w8",
      website: undefined,
      roles: [
        "Cinematographer",
        "Co-Director",
        "Writer",
        "Editor",
      ],
      highlights: [
        {
          title: "Gothamite Monthly Film Awards",
          description: "Best Web Series February 2025",
          image: "assets/images/2025_february_gothamite_best_web_series.png",
          laurel: "assets/images/laurel_winner_white_transparent.png"
        },
        {
          title: "Star City Film Festival",
          description: "Best Short Comedic Film",
          image: "assets/images/2025_star_city_film_festival_best_short_comedic_film.png",
          laurel: "assets/images/laurel_winner_white_transparent.png"
        },
        {
          title: "Star City Film Festival",
          description: "Best Cast in a Short Film",
          image: "assets/images/2025_star_city_film_festival_best_cast_in_a_short_film.png",
          laurel: "assets/images/laurel_winner_white_transparent.png"
        },
        {
          title: "Clout International Film Fest",
          description: "Best Web/TV Series",
          image: "assets/images/2025_clout_international_film_fest_best_web_tv_series.png",
          laurel: "assets/images/laurel_winner_white_transparent.png",
        },
        {
          title: "PrairieFest Film Showcase",
          description: "Official Selection",
          image: "assets/images/2025_prairiefest_film_showcase_official_selection.png",
          laurel: "assets/images/laurel_official_selection_white_transparent.png",
        },
      ],
    })

    this.matchingProjects.push({
      title: "Comet",
      description: "15 years after a comet threatens extinction on Earth, one of the astronomers who discovered it "
      + "recounts the story to her niece.",
      type: "Feature",
      genre: "Drama",
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
          image: undefined,
          laurel: undefined,
        },
        {
          title: "Richmond International Film Festival Screenplay Competition",
          description: "Semifinalist",
          image: "assets/images/2024_richmond_international_film_festival_semifinalist.png",
          laurel: "assets/images/laurel_semifinalist_white_transparent.png",
        },
        {
          title: "Creative World Awards",
          description: "Quarterfinalist",
          image: "assets/images/2024_creative_world_awards_quarterfinalist.png",
          laurel: "assets/images/laurel_quarterfinalist_white_transparent.png",
        },
      ],
    })

    this.matchingProjects.push({
      title: "I-80: An Interstate Crime Story",
      description: "A bumbling brother and sister seek petty revenge against a freight shipping magnate, drawing the "
      + "attention of a traveling gun-for-hire seeking to escape her world of violence. When she seizes an opportunity "
      + "to do so, a series of misunderstandings bring mayhem to a quiet Iowa city.",
      type: "Series",
      genre: "Crime",
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
          image: "assets/images/2024_cinequest_screenwriting_competition_semifinalist.png",
          laurel: "assets/images/laurel_semifinalist_white_transparent.png",
        },
        {
          title: "The Southern California Screenplay Competition 2023",
          description: "Quarterfinalist",
          image: "assets/images/2023_the_southern_california_screenplay_competition_quarterfinalist.png",
          laurel: "assets/images/laurel_quarterfinalist_white_transparent.png",
        },
        {
          title: "The Finish Line Script Competition 2022-2023",
          description: "Honorable Mention",
          image: "assets/images/2023_the_finish_line_script_competition_honorable_mention.png",
          laurel: undefined,
        }
      ],
    })

    this.matchingProjects.push({
      title: "Diner",
      description: "On a single night, a tentative man is wrangled into taking a role in blackmail negotiations "
        + "between a duo of inept criminals and a flighty small-time politician.",
      type: "Feature",
      genre: "Crime comedy",
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
      type: "Stage musical",
      genre: "Horror",
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

  getUniqueLaurels(project: Project) {
    return project.highlights
          .map(highlight => highlight.laurel)
          .reduce((acc, laurel) => {
            if (laurel) {
              acc[laurel] = (acc[laurel] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);
  }

  onKeyPress($event: any, index: number) {
    console.log($event.keyCode)
  }
}
