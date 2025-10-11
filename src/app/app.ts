import { Component, signal } from '@angular/core';
import { NightSkyComponent } from './layout/night-sky/night-sky';
import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [ NightSkyComponent, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio');
}
