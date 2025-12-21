import { Component, DOCUMENT, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NightSkyComponent } from './layout/night-sky/night-sky';
import { Header } from './layout/header/header';
import { Intro } from './sections/intro/intro';
import { CustomCursor } from './layout/custom-cursor/custom-cursor';
import { TechStripe } from './sections/tech-stripe/tech-stripe';
import { Experience } from './sections/experience/experience';
import { Technologies } from './sections/technologies/technologies';
import { About } from './sections/about/about';

@Component({
  selector: 'app-root',
  imports: [
    NightSkyComponent,
    Header,
    Intro,
    CustomCursor,
    TechStripe,
    Experience,
    Technologies,
    About,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly introFinished: WritableSignal<boolean> = signal(false);
  private document = inject(DOCUMENT);

  protected onIntroFinished(): void {
    this.introFinished.set(true);
    this.document.body.style.overflow = 'auto';
  }
}
