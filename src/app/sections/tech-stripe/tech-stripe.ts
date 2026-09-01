
import { Component } from '@angular/core';

@Component({
  selector: 'app-tech-stripe',
  imports: [],
  templateUrl: './tech-stripe.html',
  styleUrl: './tech-stripe.scss'
})
export class TechStripe {
  private readonly startWords: string[] = [
    'Angular',
    'TypeScript',
    'JavaScript',
    'HTML5',
    'CSS3',
    'Sass',
    'RxJS',
    'Node.js',
    'Express',
    'MongoDB',
  ];

  protected readonly words: string[] = Array(3).fill(this.startWords).flat();
}
