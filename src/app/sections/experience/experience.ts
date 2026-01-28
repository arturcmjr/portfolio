import { Component, signal } from '@angular/core';
import { ExperienceCard } from './components/experience-card/experience-card';
import { CursorType } from '@shared/directives/cursor-type';

@Component({
  selector: 'app-experience',
  imports: [ExperienceCard],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class Experience {
  selectedWorkIndex = signal(0);
  selectedEducationIndex = signal(0);
}
