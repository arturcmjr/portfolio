import {
  Component,
  OnInit,
  Renderer2,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

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
  },
})
export class CustomCursor implements OnInit {
  private renderer = inject(Renderer2);

  x = signal(0);
  y = signal(0);
  cursorClass = signal('');
  isClicked = signal(false);

  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'cursor', 'none');
  }

  onMouseMove(event: MouseEvent): void {
    this.x.set(event.clientX);
    this.y.set(event.clientY);

    const target = event.target as HTMLElement;
    this.cursorClass.set(this.getCursorClass(target));
  }

  onMouseDown(): void {
    this.isClicked.set(true);
  }

  onMouseUp(): void {
    this.isClicked.set(false);
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

  onMouseLeave(): void {
    this.cursorClass.set('hidden');
  }

  onMouseEnter(): void {
    this.cursorClass.set('');
  }
}