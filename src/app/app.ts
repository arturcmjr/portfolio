import { Component, DOCUMENT, inject, signal, WritableSignal } from '@angular/core';
import { NightSkyComponent } from './layout/night-sky/night-sky';
import { Header } from './layout/header/header';
import { Intro } from './sections/intro/intro';
import { CustomCursor } from './layout/custom-cursor/custom-cursor';
import { TechStripe } from './sections/tech-stripe/tech-stripe';
import { Experience } from './sections/experience/experience';
import { Technologies } from './sections/technologies/technologies';
import { About } from './sections/about/about';
import { Projects } from './sections/projects/projects';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Contact } from './sections/contact/contact';
import { Sidebar } from './layout/sidebar/sidebar';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Flip);
gsap.registerPlugin(ScrollToPlugin);

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
    Projects,
    Contact,
    Sidebar,
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
