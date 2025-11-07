import { Component, input } from '@angular/core';
import { Tilt } from '@shared/directives/tilt';

@Component({
  selector: 'app-experience-card',
  imports: [Tilt],
  templateUrl: './experience-card.html',
  styleUrl: './experience-card.scss',
})
export class ExperienceCard {
  title = input<string>();
  description = input<string>();
}
