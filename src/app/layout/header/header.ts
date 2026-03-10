import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { scrollToSection } from '@shared/utils/scroll-to-section';
import { fromEvent } from 'rxjs';
import { CursorType } from '@shared/directives/cursor-type';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [CursorType, TranslateModule],
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

  protected scrollToSection = scrollToSection;
}
