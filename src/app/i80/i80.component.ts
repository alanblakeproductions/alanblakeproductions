import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address, Highlight, Person, Project, Showtime, Character } from './../util/models'

@Component({
  selector: 'app-i80',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './i80.component.html',
  styleUrl: './i80.component.less'
})
export class I80Component {

  locals: Character[] = []
  outsiders: Character[] = []

  typeToCharacters: Map<String, Character[]> = new Map<string, Character[]>();

  constructor() {
    this.typeToCharacters.set("The Locals", [
      {
        name: "Jesse Goetsch",
        image: 'jesse_goetsch_2.jpeg',
        quote: 'You give me shit because I don’t, you know, have a big fancy job. But I could do that. I could sell, '
        + 'like, cars to people that they don’t need, but I wouldn’t respect myself if I did. And you shouldn’t either.',
        summary: '<p class="uk-text">When I was 12, my dad brought me to his workplace: a glass factory in eastern Iowa. '
        + 'I clomped behind him in borrowed steel-toe boots as he explained each of the massive pieces of equipment. At '
        + 'one point he gestured to an enormous steel drum. “That\'s the paddle mixer,” he said. “One time a guy was '
        + 'cleaning in there and forgot to lock out. Someone else turned it on. They had to clean out his remains with a '
        + 'shovel.</p>'
        + '<p class="uk-text">Jesse is both the guy in the mixer and the guy who turned it on. Simply put, he\'s an idiot who pays for both '
        + 'his mistakes and others’. Overly sensitive, constantly frustrated, and chronically injured by his own '
        + 'ineptitude, Jesse is the victim of a thousand misfortunes.</p>'
        + '<p class="uk-text">The series opens after Jesse\'s latest tragedy. While working with his friend Ed Mercado at '
        + 'a fast food restaurant, a surly truck driver from Eberle Shipping Co. attempts to take his rig through the '
        + 'drive-through.  When Jesse refuses to take his order, the trucker throws a Gatorade bottle full of piss at '
        + 'him. Humiliated, Jesse enlists the help of his sister Mickey to solicit a lawyer and sue the Eberles.</p>'
      },
      {
        name: "Mickey Goetsch",
        image: 'mickey_goetsch.jpeg',
        quote: 'You\'re supposed to be grateful for what you have. But that doesn\'t make sense. If I had more than '
        + 'what I deserved, I would feel grateful. But if I have less, I also have to feel grateful? How should I feel '
        + 'if I have exactly what I deserve? Grateful? Again? Is it all -- everybody in the world -- all of us have to '
        + 'feel grateful all the time?',
        summary: '<p class="uk-text">For the 30 or so years of her life, Mickey has followed the path of the Righteous '
        + 'Iowa Woman. She\'s attended a quiet Methodist church, slipped seamlessly into the caretaker role abdicated by '
        + 'her deceased mother, and entered the practical and feminine trade of real estate agent. For that, she\'s been '
        + 'rewarded with a yearly income of $30K, four C+ sexual partners, and rapidly thinning hair.</p>'
        + '<p class="uk-text">Mickey has never gotten the respect she is due, and resentment has been building for years. '
        + 'Now she has an outlet. She wants revenge on the Eberles. To be honest, she wants revenge on everyone who '
        + 'looks down on the Righteous Iowa Woman. An opportunity to take that revenge appears almost immediately.</p>'
      },
      {
        name: "Ed Mercado",
        image: 'ed_mercado.jpeg',
        quote: 'People look down on us because we serve food through a window. Truth is, I look down on them. This '
        + 'shit\'s cancer and they’re feeding it to their children.',
        summary: '<p class="uk-text">Behind the counter of every fast food restaurant is "the guy with the theories." '
        + 'Someone comfortable in the role of Cynical Finger-Pointer. The world is run by idiots, but they’re actually '
        + 'conniving elites. Capitalism is a cancer, but fuck you, pay me. People are sheep, but power to the people. '
        + 'We\'re all alone in this world, but that\'s why you and I gotta stick together!</p>'
        + 'Ed\'s cynical front is a facade. He\'s a ride-or-die friend, he falls in love at the drop of a hat, and his '
        + 'sense of right and wrong is much more conventional than he asserts. Which is why when the tiff between the '
        + 'Goetschs and Eberles escalates to a war, Ed hesitates to show solidarity with Jesse. What exactly did the '
        + 'Eberles do to anyone, anyway?'
      },
      {
        name: "Alton Eberle",
        image: 'alton_eberle.jpeg',
        quote: 'I\'m not up for this...this cutthroat business shark stuff, okay? I’m nice. And I like when other '
        + 'people are nice. And I don\'t like suits! They\'re hot, and collars always itch my neck.',
        summary: '<p class="uk-text">Alton Eberle is a magnate, but he’d rather own an ice cream shop. As a young man he '
        + 'didn\'t have ambition or smarts, but was so good-natured and endearing that every person he met became a '
        + 'friend. One of those people was Mo Aguilar, a Midwestern shipping tycoon, who groomed Alton to be his '
        + 'replacement purely because when you’re at the top, you don’t have friends anymore: you have employees and '
        + 'business partners.</p>'
        + '<p class="uk-text">That\'s a lesson Alton is struggling to grasp. The business he was gifted is deteriorating. '
        + 'He’d much prefer to organize an employee\'s baby shower, but instead he has to pore over invoices and payroll. '
        + 'Why is his competitor in Reno trying to tear him down? Does he actually want Alton to have to fire someone? '
        + 'Alton would do almost anything than lay someone off. Including give in to his wife.'
      },
      {
        name: "Dawn Eberle",
        image: 'dawn_eberle.jpeg',
        quote: 'They go after the family because family keeps us whole. Without you they’d pick me off, and without me '
        + 'you\'d be a fucking cashier at Jiffy Lube.',
        summary: '<p class="uk-text">Dawn Eberle was raised by a mother who taught her to \"stand behind her man.\" Dawn whole-heartedly '
        + 'believes that. But she also believes that her man needs to be shoved forward and stop being such a pussy. '
        + 'Dawn refuses to embarrass Alton by going over his head or taking over his duties. She even refuses to accept '
        + 'a board position. But she’ll rap his knuckles and force him to sign on the dotted line, there, that\'s my good '
        + 'businessman husband.</p>'
        + '<p class="uk-text">If Dawn hadn’t met Alton, Eberle Shipping Co. would have wilted into a glorified U-Haul '
        + 'outpost. The company needs her hand on the scale, but even she can’t stop its decline. The Eberle name, which '
        + 'she proudly wears, is about to crumble. Dawn won’t allow her family to be embarrassed. For some time she\'s '
        + 'relied on a small network of career criminals to keep the family business in the black. But now Alton has '
        + 'meekly agreed to something far more drastic.</p>'
      }
    ]);

    this.typeToCharacters.set("The Outsiders", [
      {
        name: "Gid Depue",
        image: 'gid_depue.jpeg',
        quote: 'Your services, as always, are adequate. But I cannot pay you today, because today is the Sabbath, and '
        + 'I do not fill contracts on the Sabbath. Now get that fucking gun out of my face.',
        summary: '<p class="uk-text">Gid DePue is a devout Mormon who follows the Word of God. But he is also a '
        + 'businessman who thinks of the Word as a contract, and it is full of loopholes. A more introspective man '
        + 'would be conflicted about being a handler for career criminals. But God does not bless the sinner, and with '
        + 'Gid\'s charmed life, he must be — in fact, yes, he\'s positive — that he\'s a saint.</p>'
        + '<p class="uk-text">The quality of his clientele tests his patience, though. Drinkers, adulterers, killers. '
        + 'Take his most recent client: a wealthy shipping magnate in Iowa, sheepishly asking how much it would cost '
        + 'to have his competitor in Reno killed. Covetous jealousy. Gid is disgusted, but business is business. '
        + '$50,000, and I know just the person for the job.</p>'
      },
      {
        name: "Mal Ziaja",
        image: 'mal_ziaja.jpeg',
        quote: 'This is a beautiful garden. How do you defend it?',
        summary: '<p class="uk-text">Mal is the type of person you can’t imagine as a child. She seems to have arrived '
        + 'on Earth as a fully-formed middle-aged woman, with only the knowledge of how to look normal, but none of '
        + 'the ability to feel that way. That detachment has certainly aided her life of crime, but now, as she inches '
        + 'towards her mid-50s, that Mal begins to consider what she\'s lacking in life. What would it be like to shop '
        + 'for a dining room table? To attend a neighborhood barbecue? To hold another\'s hand?</p>'
        + '<p class="uk-text">As Mal hops in the passenger seat of an Eberle rig, on her way to kill a man in Reno who '
        + 'she\'s never met for $50,000 (minus her handler\'s fee), those questions start seeping through Mal\'s '
        + 'usually-impervious exterior. What would it be like to trade places with the person in the driver\'s seat?</p>'
      },
      {
        name: "Claudia Whipple",
        image: 'claudia_whipple.jpeg',
        quote: 'There\'s something nice about every place, I expect. But you couldn’t pay me to live in Iowa. It\'s '
        + 'Omaha for me, and I won’t be crossing the river unless I’m buying gas.',
        summary: '<p class="uk-text">Claudia Whipple has been “temporarily” driving a truck for six years. It\'s a '
        + 'means to an end, of course. Just a few more months, then she can buy a little house near her daughter in '
        + 'Nebraska. She’ll spend her entire summer planting — anything to bring color back after years of driving on '
        + 'gray asphalt.</p>'
        + '<p class="uk-text">Claudia is salt-of-the-earth. She\'s the exact audience for comedy skits on talk radio. '
        + 'She loves taffy and cheap beer. When she tells a funny story, she can’t stop giggling. She\'s nervous to be '
        + 'sitting next to the strange, wooden woman sitting beside her on the long road to Reno. But a trucker '
        + 'doesn’t get the opportunity for company often. Claudia is determined to make the best of it.</p>'
      },
      {
        name: "Vas Reddy",
        image: 'vas_reddy.jpeg',
        quote: 'Have you heard the expression: "a watched pot never boils?" It\'s untrue. Water boils no matter '
        + 'who\'s looking. But an unwatched pot is liable to boil over and burn the house down. That is to say: I '
        + 'consider this my kitchen. And I prefer to watch my pots. Especially those prone to boiling over.',
        summary: '<p class="uk-text">Vas Reddy is a fixer by trade, drifting from city to city, town to town, and '
        + 'even conversation to conversation, before dropping into them with the comfort of someone who has been '
        + 'there all along. He thinks of people the way a researcher thinks of chimpanzees.</p>'
        + '<p class="uk-text">When Vas is hired to collect a debt from Alton Eberle in Davenport, Iowa, he’s '
        + 'stimulated; small cities are as close to a vacuum as one can get, and vacuums are ideal for his '
        + 'experiments. Still, Vas prefers to leave the act of physical intimidation to those more inclined. So on '
        + 'the way to Iowa, he picks up a companion.</p>'
      },
      {
        name: "Love Jacunski",
        image: 'love_jacunski.jpeg',
        quote: 'Bite down on this. It will hurt.',
        summary: '<p class="uk-text">Love Jacunski is the opposite of Vas in every way. He is not elegant, '
        + 'introspective, or charming. He speaks in clipped sentences, heavily marred by a Polish accent. His tense '
        + 'frame and stone visage tend to silence a room — and his dead left eye, sustained in the amateur boxing '
        + 'circuit, doesn’t help.</p>'
        + '<p class="uk-text">For years, Love has been secondary muscle on a contractual basis. His only stipulation '
        + 'is that he not be required to work mornings, so that he can wake early and watch European soccer leagues '
        + 'live. It is these mornings Love enjoys most. With dew on the grass and the world quiet, Love sits across '
        + 'from a TV in boxers and socks, mouthing along to the commentary, as if by doing so he will become more '
        + 'vocal.</p>'
      }
    ]);
  }

  returnZero() {
    return 0;
  }
}
