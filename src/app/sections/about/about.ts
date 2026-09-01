import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  viewChild,
  ElementRef,
  DestroyRef,
  inject,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SectionHeader } from '@app/layout/section-header/section-header';
import { gsap } from 'gsap';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.scss',
  imports: [SectionHeader, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly paragraphElement = viewChild<ElementRef<HTMLElement>>('paragraphElement');
  private animation?: gsap.core.Tween;

  constructor() {
    this.destroyRef.onDestroy(() => this.disposeAnimation());
  }

  ngAfterViewInit(): void {
    this.initAnimation();
  }

  private initAnimation(): void {
    this.disposeAnimation();

    const paragraph = this.paragraphElement()?.nativeElement;
    if (!paragraph) return;

    this.animation = gsap.fromTo(
      paragraph,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: paragraph,
          start: 'top 90%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      },
    );
  }

  private disposeAnimation(): void {
    this.animation?.kill();
    this.animation = undefined;
  }
}
