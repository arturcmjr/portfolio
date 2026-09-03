import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  EducationExperience,
  WorkExperience,
} from '@app/data/models/experince.model';
import { ExperienceCard } from '@app/sections/experience/components/experience-card/experience-card';
import { gsap } from 'gsap';
import { SectionHeader } from '@app/layout/section-header/section-header';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';

interface ExperienceTranslations {
  workTitle: string;
  educationTitle: string;
  currentLabel: string;
  workExperience: WorkExperience[];
  education: EducationExperience[];
}

interface ExperienceCardViewModel {
  title: string;
  meta: string;
  description: string;
  collapsed: boolean;
}

@Component({
  selector: 'app-experience',
  imports: [ExperienceCard, SectionHeader],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience implements AfterViewInit {
  private readonly translate = inject(TranslateService);
  private readonly workExperiencesListElement =
    viewChild<ElementRef<HTMLElement>>('workExperiencesList');
  private readonly educationExperiences =
    viewChild<ElementRef<HTMLElement>>('educationExperiences');
  private readonly fallbackData: ExperienceTranslations = {
    workTitle: 'Work Experience',
    educationTitle: 'Education',
    currentLabel: 'Present',
    workExperience: [],
    education: [],
  };

  private readonly translatedData = toSignal(
    this.translate.stream('experience').pipe(map((value) => this.asExperienceTranslations(value))),
    { initialValue: this.fallbackData },
  );

  protected readonly workTitle = computed(() => this.translatedData().workTitle);
  protected readonly educationTitle = computed(() => this.translatedData().educationTitle);
  protected readonly currentLabel = computed(() => this.translatedData().currentLabel);
  protected readonly workExperience = computed(() => this.translatedData().workExperience);
  protected readonly education = computed(() => this.translatedData().education);

  protected readonly selectedWorkIndex = signal(0);
  protected readonly selectedEducationIndex = signal(0);

  protected readonly workCards = computed<ExperienceCardViewModel[]>(() => {
    const currentLabel = this.currentLabel();
    const selectedWorkIndex = this.selectedWorkIndex();

    return this.workExperience().map((item, index) => ({
      title: `${item.position} - ${item.company}`,
      meta: `${item.location} • ${item.workMode} • ${item.startDate} - ${item.endDate ?? currentLabel}`,
      description: item.description,
      collapsed: selectedWorkIndex !== index,
    }));
  });

  protected readonly educationCards = computed<ExperienceCardViewModel[]>(() => {
    const selectedEducationIndex = this.selectedEducationIndex();

    return this.education().map((item, index) => ({
      title: item.degree,
      meta: `${item.institution} • ${item.completionDate}`,
      description: item.description,
      collapsed: selectedEducationIndex !== index,
    }));
  });

  ngAfterViewInit(): void {
    const workList = this.workExperiencesListElement();
    const educationList = this.educationExperiences();
    if (workList) this.animateItems(workList, 'left');
    if (educationList) this.animateItems(educationList, 'right');
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

  private asExperienceTranslations(value: unknown): ExperienceTranslations {
    if (!value || typeof value !== 'object') {
      return this.fallbackData;
    }

    const parsedValue = value as Partial<ExperienceTranslations>;

    return {
      workTitle:
        typeof parsedValue.workTitle === 'string'
          ? parsedValue.workTitle
          : this.fallbackData.workTitle,
      educationTitle:
        typeof parsedValue.educationTitle === 'string'
          ? parsedValue.educationTitle
          : this.fallbackData.educationTitle,
      currentLabel:
        typeof parsedValue.currentLabel === 'string'
          ? parsedValue.currentLabel
          : this.fallbackData.currentLabel,
      workExperience: Array.isArray(parsedValue.workExperience)
        ? (parsedValue.workExperience as WorkExperience[])
        : this.fallbackData.workExperience,
      education: Array.isArray(parsedValue.education)
        ? (parsedValue.education as EducationExperience[])
        : this.fallbackData.education,
    };
  }
}
