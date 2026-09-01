import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ObserveVisibilityDirective } from '@shared/directives/observe-visibility';
import { TechIcon } from './components/tech-icon/tech-icon';
import { gsap } from 'gsap';
import { SectionHeader } from '@app/layout/section-header/section-header';
import { TranslateModule } from '@ngx-translate/core';
import { isMobile } from 'is-mobile';

@Component({
  selector: 'app-technologies',
  imports: [ObserveVisibilityDirective, TechIcon, SectionHeader, TranslateModule],
  templateUrl: './technologies.html',
  styleUrl: './technologies.scss',
})
export class Technologies implements OnInit {
  protected readonly visible: WritableSignal<boolean> = signal(false);
  protected readonly isMobile = isMobile();

  protected onVisibilityChange(isVisible: boolean): void {
    this.visible.set(isVisible);
  }

  ngOnInit(): void {
    const techGrid = document.querySelector('.tech-grid') as HTMLElement;
    gsap.from('app-tech-icon', {
      opacity: 0,
      y: 100,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: techGrid,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });
  }
}
