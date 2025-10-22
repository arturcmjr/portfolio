import {
  Component,
  signal,
  inject,
  DOCUMENT,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import { CursorType } from '../../shared/directives/cursor-type';

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
export class Header implements OnInit, OnDestroy {
  hiddenInput = input<boolean>(false, { alias: 'hidden' });

  private readonly document = inject(DOCUMENT);
  protected readonly hidden = signal(false);

  private lastScroll = 0;
  private scrollListener = this.onScroll.bind(this);

  ngOnInit() {
    this.document.body?.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  ngOnDestroy() {
    this.document.body?.removeEventListener('scroll', this.scrollListener);
  }

  private onScroll() {
    const currentScroll =
      this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

    if (currentScroll > this.lastScroll) {
      this.hidden.set(true);
    } else {
      this.hidden.set(false);
    }

    this.lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  }
}
