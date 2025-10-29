import { Component, DOCUMENT, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { NightSkyComponent } from './layout/night-sky/night-sky';
import { Header } from './layout/header/header';
import { Intro } from './sections/intro/intro';
import { CustomCursor } from './layout/custom-cursor/custom-cursor';
import { TechStripe } from './sections/tech-stripe/tech-stripe';

@Component({
  selector: 'app-root',
  imports: [NightSkyComponent, Header, Intro, CustomCursor, TechStripe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly introFinished: WritableSignal<boolean> = signal(false);
  private document = inject(DOCUMENT);

  ngOnInit() {
    window.setTimeout(() => {
      this.onIntroFinished();
    }, 3000);
  }

  private onIntroFinished(): void {
    this.introFinished.set(true);
    this.document.body.style.overflow = 'auto';
  }
}
