import {
  Component,
  afterNextRender,
  ChangeDetectionStrategy,
  ElementRef,
  viewChild,
  signal,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface YearExperience {
  year: number;
  experiences: { title: string; description: string }[];
}

interface VisibleIndex {
  yearIndex: number;
  experienceIndex: number;
}

@Component({
  selector: 'app-experience-v2',
  templateUrl: './experience-v2.html',
  styleUrls: ['./experience-v2.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceV2 {
  years = signal<YearExperience[]>([
    {
      year: 2025,
      experiences: [
        { title: 'Future Project A', description: 'Description of future project A.' },
        { title: 'Future Project B', description: 'Description of future project B.' },
      ],
    },
    {
      year: 2024,
      experiences: [
        { title: 'Ongoing Project X', description: 'Description of ongoing project X.' },
        { title: 'Ongoing Project Y', description: 'Description of ongoing project Y.' },
      ],
    },
    {
      year: 2023,
      experiences: [
        { title: 'Recent Project 1', description: 'Description of recent project 1.' },
        { title: 'Recent Project 2', description: 'Description of recent project 2.' },
        { title: 'Recent Project 3', description: 'Description of recent project 3.' },
        { title: 'Recent Project 4', description: 'Description of recent project 4.' },
      ],
    },
    {
      year: 2022,
      experiences: [{ title: 'Project Alpha', description: 'Description of project Alpha.' }],
    },
    {
      year: 2021,
      experiences: [{ title: 'Project Beta', description: 'Description of project Beta.' }],
    },
    {
      year: 2020,
      experiences: [{ title: 'Project Gamma', description: 'Description of project Gamma.' }],
    },
    {
      year: 2019,
      experiences: [
        { title: 'Project Delta', description: 'Description of project Delta.' },
        { title: 'Project Epsilon', description: 'Description of project Epsilon.' },
      ],
    },
    {
      year: 2018,
      experiences: [{ title: 'Project Zeta', description: 'Description of project Zeta.' }],
    },
    {
      year: 2017,
      experiences: [{ title: 'Project Eta', description: 'Description of project Eta.' }],
    },
    {
      year: 2016,
      experiences: [{ title: 'Project Theta', description: 'Description of project Theta.' }],
    },
  ]);
  // bidimensional index, the first is the year index, the second is the experience index within that year
  visibleIndexes = signal<VisibleIndex | null>(null);
  svgElement = viewChild<ElementRef<SVGSVGElement>>('circularSvg');
  targetBox = viewChild<ElementRef<HTMLDivElement>>('targetBox');

  constructor() {
    afterNextRender(() => {
      gsap.registerPlugin(ScrollTrigger);
      this.initScrollAnimation();
    });
  }

  private initScrollAnimation(): void {
    gsap.fromTo(
      '.circular-text textPath',
      {
        attr: { startOffset: '-121.5%' },
      },
      {
        attr: { startOffset: '32%' },
        ease: 'none',
        scrollTrigger: {
          trigger: '.experience-container',
          start: 'top 80px',
          end: '+=5000',
          scrub: 1,
          pin: true,
          markers: true,
          onUpdate: () => this.detectVisibleItem(),
        },
      }
    );
  }

  private detectVisibleItem(): void {
    const svg = this.svgElement()?.nativeElement;
    const targetDiv = this.targetBox()?.nativeElement;

    if (!svg || !targetDiv) return;

    const targetRect = targetDiv.getBoundingClientRect();
    const textPath = svg.querySelector('.years-path');
    if (!textPath) return;

    const tspans = Array.from(textPath.querySelectorAll('tspan'));

    for (let i = 0; i < tspans.length; i++) {
      const tspan = tspans[i] as SVGTSpanElement;

      try {
        const bbox = tspan.getBBox();
        const svgPoint = svg.createSVGPoint();
        svgPoint.x = bbox.x + bbox.width / 2;
        svgPoint.y = bbox.y + bbox.height / 2;

        const screenCTM = svg.getScreenCTM();
        if (!screenCTM) continue;

        const screenPoint = svgPoint.matrixTransform(screenCTM);

        const isInTarget =
          screenPoint.x >= targetRect.left &&
          screenPoint.x <= targetRect.right &&
          screenPoint.y >= targetRect.top &&
          screenPoint.y <= targetRect.bottom;

        if (isInTarget) {
          const visibleIndex = this.getVisibleIndexes(i);
          this.visibleIndexes.set(visibleIndex);
          if(visibleIndex) {
            const yearData = this.years()[visibleIndex.yearIndex];
            const experienceData = yearData.experiences[visibleIndex.experienceIndex];
            console.log(`Visible Experience: ${experienceData.title} (${yearData.year})`);
          }
          return;
        }
      } catch (error) {
        continue;
      }
    }
  }

  private getVisibleIndexes(tspanIndex: number): VisibleIndex | null {
    let currentIndex = 0;

    for (let yearIndex = 0; yearIndex < this.years().length; yearIndex++) {
      const yearData = this.years()[yearIndex];

      for (let expIndex = 0; expIndex < yearData.experiences.length; expIndex++) {
        if (currentIndex === tspanIndex) {
          return { yearIndex, experienceIndex: expIndex };
        }
        currentIndex++;
      }

      if (currentIndex === tspanIndex) {
        return { yearIndex, experienceIndex: yearData.experiences.length - 1 };
      }
      currentIndex++;
    }

    return null;
  }
}
