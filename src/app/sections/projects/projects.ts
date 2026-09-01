import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Tilt } from '@shared/directives/tilt';
import { SectionHeader } from 'app/layout/section-header/section-header';

@Component({
  selector: 'app-projects',
  imports: [Tilt, SectionHeader],
  templateUrl: './projects.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './projects.scss'
})
export class Projects {

}
