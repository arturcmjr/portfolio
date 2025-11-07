import { Component } from '@angular/core';
import { ExperienceCard } from './components/experience-card/experience-card';

@Component({
  selector: 'app-experience',
  imports: [ExperienceCard],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class Experience {}
