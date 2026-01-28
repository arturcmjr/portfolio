import { Component } from '@angular/core';
import { Tilt } from '@shared/directives/tilt';
import { SectionHeader } from 'app/layout/section-header/section-header';

@Component({
  selector: 'app-projects',
  imports: [Tilt, SectionHeader],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {

}
