import { Component, signal } from '@angular/core';
import { NightSkyComponent } from './layout/night-sky/night-sky';

@Component({
  selector: 'app-root',
  imports: [ NightSkyComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio');
}
