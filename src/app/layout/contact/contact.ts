import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { SectionHeader } from '../section-header/section-header';
import { CursorType } from '@shared/directives/cursor-type';
import { ContactIcon } from './components/contact-icon/contact-icon';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

@Component({
  selector: 'app-contact',
  imports: [SectionHeader, CursorType, ContactIcon],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements AfterViewInit, OnDestroy {
  icons = viewChildren(ContactIcon);
  iconsContainer = viewChild<ElementRef<HTMLElement>>('iconsContainer');
  desktopContainer = viewChild<ElementRef<HTMLElement>>('desktopContainer');

  private scrollTrigger: ScrollTrigger | null = null;
  private currentFlipAnimation: gsap.core.Timeline | null = null;
  private inIconsContainer = false;

  protected readonly showLabel = signal(false);

  ngAfterViewInit(): void {
    const triggerElement = this.iconsContainer()?.nativeElement;
    if (!triggerElement) {
      return;
    }

    this.scrollTrigger = ScrollTrigger.create({
      trigger: triggerElement,
      start: 'top bottom',
      end: 'bottom top',
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
    this.showLabel.set(false);
    window.setTimeout(() => this.flipIcons('icons', 'desktop'));
  }

  private flipToIconsContainer(): void {
    this.showLabel.set(true);
    window.setTimeout(() => this.flipIcons('desktop', 'icons'));
  }

  private flipIcons(from: 'desktop' | 'icons', to: 'desktop' | 'icons'): void {
    const desktopContainer = this.desktopContainer()?.nativeElement;
    const iconsContainer = this.iconsContainer()?.nativeElement;
    if (!desktopContainer || !iconsContainer) {
      return;
    }

    const movingToIcons = to === 'icons';
    if (this.inIconsContainer === movingToIcons) {
      return;
    }

    const sourceContainer = from === 'desktop' ? desktopContainer : iconsContainer;
    const targetContainer = to === 'desktop' ? desktopContainer : iconsContainer;
    const sourceIsFixed = getComputedStyle(sourceContainer).position === 'fixed';
    const targetIsFixed = getComputedStyle(targetContainer).position === 'fixed';
    const hasFixedContainer = sourceIsFixed || targetIsFixed;

    const icons = Array.from(sourceContainer.querySelectorAll<HTMLElement>('app-contact-icon'));
    if (icons.length === 0) {
      return;
    }

    const state = Flip.getState(icons, { simple: true });
    targetContainer.append(...icons);

    this.currentFlipAnimation?.kill();
    this.currentFlipAnimation = Flip.from(state, {
      targets: icons,
      absolute: !hasFixedContainer,
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

    this.inIconsContainer = movingToIcons;
  }
}
