import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { CursorType } from '@shared/directives/cursor-type';
import { ContactIcon } from './components/contact-icon/contact-icon';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isMobileDevice } from '@shared/utils/utils';
import { SectionHeader } from 'app/layout/section-header/section-header';
enum Container {
  Icons,
  Desktop,
}

@Component({
  selector: 'app-contact',
  imports: [SectionHeader, CursorType, ContactIcon],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly hideIcons = input<boolean>(false);

  private readonly iconsContainer = viewChild<ElementRef<HTMLElement>>('iconsContainer');
  private readonly desktopContainer = viewChild<ElementRef<HTMLElement>>('desktopContainer');

  private scrollTrigger: ScrollTrigger | null = null;
  private currentFlipAnimation: gsap.core.Timeline | null = null;

  protected readonly desktopView = signal(false);

  private get iconElements(): HTMLElement[] {
    const icons = this.elementRef.nativeElement.querySelectorAll(
      'app-contact-icon',
    ) as NodeListOf<HTMLElement>;
    return Array.from(icons);
  }

  ngAfterViewInit(): void {
    if (isMobileDevice()) return;

    this.flipToDesktopContainer();

    const triggerElement = this.iconsContainer()?.nativeElement;
    if (!triggerElement) {
      return;
    }

    this.scrollTrigger = ScrollTrigger.create({
      trigger: triggerElement,
      start: 'top 80%',
      end: '50% top',
      
      onEnter: () => this.flipToIconsContainer(),
      onEnterBack: () => this.flipToIconsContainer(),
      onLeave: () => this.flipToDesktopContainer(),
      onLeaveBack: () => this.flipToDesktopContainer(),
    });
  }

  ngOnDestroy(): void {
    this.currentFlipAnimation?.kill();
    this.currentFlipAnimation = null;
    this.scrollTrigger?.kill();
    this.scrollTrigger = null;
  }

  private flipToDesktopContainer(): void {
    this.desktopView.set(true);
    window.setTimeout(() => this.flipIcons(Container.Desktop));
  }

  private flipToIconsContainer(): void {
    this.desktopView.set(false);
    window.setTimeout(() => this.flipIcons(Container.Icons));
  }

  private flipIcons(to: Container): void {
    const desktopContainer = this.desktopContainer()?.nativeElement;
    const iconsContainer = this.iconsContainer()?.nativeElement;
    if (!desktopContainer || !iconsContainer) return;

    const targetContainer = to === Container.Desktop ? desktopContainer : iconsContainer;

    const icons = this.iconElements;
    if (icons.length === 0) return;

    const state = Flip.getState(icons, { simple: true });
    targetContainer.append(...icons);

    this.currentFlipAnimation?.kill();
    this.currentFlipAnimation = Flip.from(state, {
      targets: icons,
      absolute: false,
      nested: true,
      prune: true,
      simple: true,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.05,
      overwrite: true,
      onComplete: () => {
        this.currentFlipAnimation = null;
      },
    });
  }
}
