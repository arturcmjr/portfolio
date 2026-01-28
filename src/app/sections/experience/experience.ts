import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import { ExperienceCard } from './components/experience-card/experience-card';
import { gsap } from 'gsap';
import { SectionHeader } from 'app/layout/section-header/section-header';

@Component({
  selector: 'app-experience',
  imports: [ExperienceCard, SectionHeader],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience implements AfterViewInit {
  private readonly workExperiencesListElement =
    viewChild<ElementRef<HTMLElement>>('workExperiencesList');
  private readonly educationExperiences =
    viewChild<ElementRef<HTMLElement>>('educationExperiences');

  protected readonly selectedWorkIndex = signal(0);
  protected readonly selectedEducationIndex = signal(0);

  ngAfterViewInit(): void {
    const workList = this.workExperiencesListElement();
    const educationList = this.educationExperiences();
    if (workList) this.animateItems(workList, 'left');
    if (educationList) this.animateItems(educationList, 'right');
    this.animateTitle();
  }

  private animateItems(parent: ElementRef<HTMLElement>, direction: 'left' | 'right'): void {
    const items = parent.nativeElement.querySelectorAll('app-experience-card');
    if (items.length === 0) return;
    const xOffset = direction === 'left' ? -50 : 50;

    gsap.from(items, {
      opacity: 0,
      x: xOffset,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: parent.nativeElement,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });
  }

  private animateTitle(): void {
    // 2 elements with class 'small-title' exist; animate both. but only the ones inside this component
    const titles = document.querySelectorAll('app-experience .small-title');
    gsap.from(titles, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: titles[0],
        start: 'top 90%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });
  }
}
