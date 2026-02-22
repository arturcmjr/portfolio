import {
  Component,
  signal,
  inject,
  DOCUMENT,
  OnInit,
  DestroyRef,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { CursorType } from '../../shared/directives/cursor-type';
import { gsap } from 'gsap';

@Component({
  selector: 'app-header',
  imports: [CursorType],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'glass',
    '[class.hidden]': 'hidden() || hiddenInput()',
  },
})
export class Header implements OnInit {
  hiddenInput = input<boolean>(false, { alias: 'hidden' });

  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly hidden = signal(false);

  private lastScroll = 0;

  ngOnInit() {
    fromEvent(this.document, 'scroll', { passive: true, capture: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onScroll());
  }

  private onScroll() {
    const currentScroll = this.document.documentElement.scrollTop || 0;

    if (currentScroll > this.lastScroll) {
      this.hidden.set(true);
    } else {
      this.hidden.set(false);
    }

    this.lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  }

  protected scrollToSection(sectionId: string) {
    // do scroll to section with id using gsap
    const target = this.document.getElementById(sectionId);
    if (target) {
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 70 },
        duration: 1,
        ease: 'power2.out',
      });
    }
  }
}
