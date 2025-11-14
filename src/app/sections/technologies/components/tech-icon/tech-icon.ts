import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ElementRef,
  inject,
  signal,
  WritableSignal,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap/gsap-core';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-tech-icon',
  imports: [FontAwesomeModule, FaIconComponent],
  templateUrl: './tech-icon.html',
  styleUrl: './tech-icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class TechIcon {
  private readonly iconWrapper = viewChild<ElementRef<HTMLDivElement>>('iconWrapper');

  readonly iconName = input<string>();
  readonly iconSrc = computed(() => `icons/${this.iconName()}.svg`);
  private currentAnimation: gsap.core.Tween | null = null;

  protected readonly isRotated: WritableSignal<boolean> = signal(false);
  protected readonly icons = {
    faStarSolid,
    faStarOutline,
  };

  onMouseEnter(): void {
    if (this.currentAnimation) {
      this.currentAnimation.kill();
    }
    this.currentAnimation = gsap.to(this.iconWrapper()!.nativeElement, {
      rotationY: 180,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => this.checkProgress(),
    });
  }

  onMouseLeave(): void {
    if (this.currentAnimation) {
      this.currentAnimation.kill();
    }
    this.currentAnimation = gsap.to(this.iconWrapper()!.nativeElement, {
      rotationY: 0,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => this.checkProgress(),
    });
  }

  private checkProgress(): void {
    const rotationY = gsap.getProperty(this.iconWrapper()!.nativeElement, 'rotationY') as number;
    if (rotationY >= 90 && !this.isRotated()) {
      this.isRotated.set(true);
    } else if (rotationY < 90 && this.isRotated()) {
      this.isRotated.set(false);
    }
  }
}
