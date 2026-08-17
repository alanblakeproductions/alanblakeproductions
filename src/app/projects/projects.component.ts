import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Address, Highlight, Person, Project, Showtime } from './../util/models'

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.less'
})
export class ProjectsComponent {

  form!: FormGroup;

  allProjects: Project[] = []
  allRoles: string[] = []
  allTypes: string[] = []
  allGenres: string[] = []

  numSelectedRoles: number = 0;
  numSelectedTypes: number = 0;
  numSelectedGenres: number = 0;

  matchingProjects: Project[] = []

  constructor(private formBuilder: FormBuilder) {
    this.initAllProjects();
    this.initAllRoles();
    this.initAllTypes();
    this.initAllGenres();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      roles: this.formBuilder.array(
        this.allRoles.map(() => new FormControl(false))
      ),
      types: this.formBuilder.array(
        this.allTypes.map(() => new FormControl(false))
      ),
      genres: this.formBuilder.array(
        this.allGenres.map(() => new FormControl(false))
      ),
    });

    this.form.valueChanges.subscribe(value => {
      const selectedRoles: Set<string> = new Set();
      for (const [index, selected] of value.roles.entries()) {
        if (selected) {
          selectedRoles.add(this.allRoles[index]);
        }
      }

      const selectedTypes: Set<string> = new Set();
      for (const [index, selected] of value.types.entries()) {
        if (selected) {
          selectedTypes.add(this.allTypes[index]);
        }
      }

      const selectedGenres: Set<string> = new Set();
      for (const [index, selected] of value.genres.entries()) {
        if (selected) {
          selectedGenres.add(this.allGenres[index]);
        }
      }

      this.numSelectedRoles = selectedRoles.size;
      this.numSelectedTypes = selectedTypes.size;
      this.numSelectedGenres = selectedGenres.size;

      this.matchingProjects = this.allProjects.filter(project => {
        let matchesSelectedRoles: boolean = true;
        let matchesSelectedTypes: boolean = true;
        let matchesSelectedGenres: boolean = true;

        if (selectedRoles.size > 0) {
          matchesSelectedRoles = project.roles.some(role => selectedRoles.has(role));
        }
        if (selectedTypes.size > 0) {
          matchesSelectedTypes = selectedTypes.has(project.type);
        }
        if (selectedGenres.size > 0) {
          matchesSelectedGenres = project.genres.some(genre => selectedGenres.has(genre));
        }

        return matchesSelectedRoles && matchesSelectedTypes && matchesSelectedGenres;
      });
    });

    this.matchingProjects = this.allProjects;
  }

  get rolesFormArray(): FormArray {
    return this.form.get('roles') as FormArray;
  }

  private initAllProjects(): void {
    this.allProjects.push({
      title: "Wrestle Indie Park",
      description: "Residents, volunteers, and wrestlers celebrate the 10th anniversary of a community event in the Logan Square neighborhood in Chicago.",
      type: "Short",
      genres: ["Documentary"],
      startYear: 2026,
      endYear: 2026,
      image: "assets/images/jr-lindsey-ring.png",
      image_attribution: undefined,
      coverfly: undefined,
      youtube: undefined,
      website: undefined,
      roles: [
        "Editor",
      ],
      highlights: [
      ],
    });

    this.allProjects.push({
      title: "Colorblind",
      description: "Two adult daughters buy their father colorblind corrective lenses for his birthday, provoking an unexpected reaction.",
      type: "Short",
      genres: ["Comedy"],
      startYear: 2026,
      endYear: 2026,
      image: "assets/images/colorblind-girls.png",
      image_attribution: undefined,
      coverfly: undefined,
      youtube: "https://www.youtube.com/watch?v=2ymAXPA-4GE",
      website: undefined,
      roles: [
        "Writer",
        "Director",
        "Editor",
      ],
      highlights: [
      ],
    });

    this.allProjects.push({
      title: "The Scorekeeper",
      description: "On the eve of a first date, a young woman is stalked by a supernatural AV cart-hauling interloper intent on forcing her to reckon with a traumatic past.",
      type: "Short",
      genres: ["Horror"],
      startYear: 2026,
      endYear: 2026,
      image: "assets/images/scorekeeper_pinkies_1.png",
      image_attribution: undefined,
      coverfly: undefined,
      youtube: undefined,
      website: undefined,
      roles: [
        "Editor",
      ],
      highlights: [
        {
          title: "XL Film Festival",
          description: "Official Selection",
          image: "assets/images/2026_xl_film_festival_official_selection.png",
          laurel: "assets/images/laurel_official_selection_white_transparent.png",
        },
        {
          title: "Black Harvest Film Festival",
          description: "Official Selection",
          image: "assets/images/2026_black_harvest_film_festival_official_selection.png",
          laurel: "assets/images/laurel_official_selection_white_transparent.png",
        },
      ],
    });

    this.allProjects.push({
      title: "Deepa",
      description: "A middle-aged South Asian wife and mother is jolted into digging around for deeper meaning in the stable container that is her family life.",
      type: "Short",
      genres: ["Drama"],
      startYear: 2025,
      endYear: 2025,
      image: "assets/images/deepa_open_1.png",
      image_attribution: undefined,
      coverfly: undefined,
      youtube: "https://www.youtube.com/watch?v=f5jqfmfFexM",
      website: undefined,
      roles: [
        "Cinematographer",
        "Editor",
      ],
      highlights: [
        {
          title: "Women Make Movies Film Festival",
          description: "Official Selection",
          image: "assets/images/women_make_movies_film_festival_official_selection.png",
          laurel: "assets/images/laurel_official_selection_white_transparent.png",
        },
        {
          title: "Patrick Lives On Film Showcase & Fundraiser",
          description: "Official Selection",
          image: "assets/images/patrick_lives_on_film_showcase_and_fundraiser_official_selection.png",
          laurel: "assets/images/laurel_official_selection_white_transparent.png",
        },
        {
          title: "MOM Film Fest",
          description: "Official Selection",
          image: "assets/images/2026_mom_film_fest_official_selection.png",
          laurel: "assets/images/laurel_official_selection_white_transparent.png",
        },
        {
          title: "Women's International Film Festival",
          description: "Official Selection",
          image: "assets/images/2026_womens_international_film_festival_official_selection.png",
          laurel: "assets/images/laurel_official_selection_white_transparent.png",
        },
      ],
    });

    this.allProjects.push({
      title: "Sedgwick",
      description: "A malevalent ghoul walks the streets of Chicago, embedding itself in the city inhabitants' lives. "
        + "For some, it inspires fear; for others, its predictable and violent nature presents opportunity.",
      type: "Short series",
      genres: ["Horror"],
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

    this.allProjects.push({
      title: "Immortal",
      description: "Dreading aging and death, a man takes severe measures to guarantee his immortality.",
      type: "Short",
      genres: ["Horror"],
      startYear: 2025,
      endYear: 2025,
      image: "assets/images/immortal_colorgrade.png",
      image_attribution: undefined,
      coverfly: undefined,
      youtube: "https://youtu.be/4qOK4SSH0Gw",
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
        {
          title: "City of Lights Film Festival",
          description: "Official Selection",
          image: "assets/images/2025_city_of_lights_film_festival_official_selection.png",
          laurel: "assets/images/laurel_official_selection_white_transparent.png",
        },
        {
          title: "American Filmatic Arts Awards",
          description: "Best Director in Short Film",
          image: "assets/images/2025_american_filmatic_arts_awards_best_director_in_short_film.png",
          laurel: "assets/images/laurel_winner_white_transparent.png",
        },
      ],
    })

    this.allProjects.push({
      title: "Love Me (K)not",
      description: "Distraught by dating woes, Chicago 30-somethings Jesse and Alice reluctantly enter the realm of "
        + "online dating with the often misguided help of friends and acquaintances.",
      type: "Web series",
      genres: ["Rom-com"],
      startYear: 2023,
      endYear: undefined,
      image: "assets/images/love_me_knot_kelly_bar.png",
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
        {
          title: "Women's Comedy Film Festival in Atlanta",
          description: "Official Selection",
          image: "assets/images/2026_womens_comedy_festival_in_atlanta_official_selection.png",
          laurel: "assets/images/laurel_official_selection_white_transparent.png",
        }
      ],
    })

    this.allProjects.push({
      title: "Comet",
      description: "15 years after a comet threatens extinction on Earth, one of the astronomers who discovered it "
      + "recounts the story to her niece.",
      type: "Feature",
      genres: [
        "Sci-fi",
        "Drama",
      ],
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

    this.allProjects.push({
      title: "I-80: An Interstate Crime Story",
      description: "A bumbling brother and sister seek petty revenge against a freight shipping magnate, drawing the "
      + "attention of a traveling gun-for-hire seeking to escape her world of violence. When she seizes an opportunity "
      + "to do so, a series of misunderstandings bring mayhem to a quiet Iowa city.",
      type: "Series",
      genres: ["Crime"],
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

    this.allProjects.push({
      title: "Diner",
      description: "On a single night, a tentative man is wrangled into taking a role in blackmail negotiations "
        + "between a duo of inept criminals and a flighty small-time politician.",
      type: "Feature",
      genres: [
        "Crime",
        "Comedy",
      ],
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

    this.allProjects.push({
      title: "The Shearing",
      description: "A revisionist retelling of the Silence of the Lambs in musical form.",
      type: "Stage musical",
      genres: ["Horror"],
      startYear: 2022,
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
    });
  }

  private initAllRoles(): void {
    let roles = new Set(this.allProjects.flatMap(project => project.roles).sort());
    this.allRoles = [...roles];
  }

  private initAllTypes(): void {
    let types = new Set(this.allProjects.map(project => project.type).sort());
    this.allTypes = [...types];
  }

  private initAllGenres(): void {
    let genres = new Set(this.allProjects.flatMap(project => project.genres).sort());
    this.allGenres = [...genres];
  }

  returnZero() {
    return 0;
  }

  getId(project: Project) {
    return project.title.replaceAll(/[^a-zA-Z0-9]/g, "-")
  }

  getNextId(index: number) {
    if (index == this.allProjects.length - 1) {
      return this.getId(this.allProjects[0]);
    }
    return this.getId(this.allProjects[index + 1])
  }

  getPreviousId(index: number) {
    if (index == 0) {
      return this.getId(this.allProjects[this.allProjects.length - 1]);
    }
    return this.getId(this.allProjects[index - 1])
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

  getImageLabelClass(project: Project): string {
    switch (project.type) {
      case "Short":
      case "Feature":
        return "uk-label-black";
      case "Episodic short series":
      case "Series":
      case "Web series":
        return "";
      case "Stage musical":
        return "uk-label-warning";
      default:
        console.log(project.type);
        return "";
    }
  }

  clearForm(): void {
    this.form.reset();
  }
}
