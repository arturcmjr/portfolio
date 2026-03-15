import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import isMobile from 'is-mobile';

@Component({
  selector: 'app-custom-cursor',
  imports: [CommonModule],
  templateUrl: './custom-cursor.html',
  styleUrls: ['./custom-cursor.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:mousemove)': 'onMouseMove($event)',
    '(document:mouseleave)': 'onMouseLeave()',
    '(document:mouseenter)': 'onMouseEnter()',
    '(document:mousedown)': 'onMouseDown()',
    '(document:mouseup)': 'onMouseUp()',
    '(window:resize)': 'onWindowResize()',
  },
})
export class CustomCursor implements OnInit, OnDestroy {
  private renderer = inject(Renderer2);
  private readonly bodyCursorClass = 'custom-cursor-enabled';
  protected readonly showCustomCursor = signal(false);

  protected readonly x = signal(0);
  protected readonly y = signal(0);
  protected readonly cursorClass = signal('');
  protected readonly isClicked = signal(false);

  ngOnInit(): void {
    this.updateCursorMode();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, this.bodyCursorClass);
  }

  protected onWindowResize(): void {
    this.updateCursorMode();
  }

  protected onMouseMove(event: MouseEvent): void {
    if (!this.showCustomCursor()) return;

    this.x.set(event.clientX);
    this.y.set(event.clientY);

    const target = event.target as HTMLElement;
    this.cursorClass.set(this.getCursorClass(target));
  }

  protected onMouseDown(): void {
    if (!this.showCustomCursor()) return;

    this.isClicked.set(true);
  }

  protected onMouseUp(): void {
    if (!this.showCustomCursor()) return;

    this.isClicked.set(false);
  }

  protected onMouseLeave(): void {
    if (!this.showCustomCursor()) return;

    this.cursorClass.set('hidden');
  }

  protected onMouseEnter(): void {
    if (!this.showCustomCursor()) return;

    this.cursorClass.set('');
  }


  private getCursorClass(el: HTMLElement): string {
    if (!el) return '';

    let current: HTMLElement | null = el;
    while (current) {
      const cursorType = current.dataset['cursor'];
      if (cursorType) {
        return `cursor-${cursorType}`;
      }

      current = current.parentElement;
    }

    return '';
  }
  
  private updateCursorMode(): void {
    const enabled = !isMobile();
    this.showCustomCursor.set(enabled);

    if (enabled) {
      this.renderer.addClass(document.body, this.bodyCursorClass);
      return;
    }

    this.renderer.removeClass(document.body, this.bodyCursorClass);
    this.cursorClass.set('');
    this.isClicked.set(false);
  }
}