import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { gsap } from 'gsap/gsap-core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly visible = signal(false);
  private readonly document = inject(DOCUMENT);
  private previousBodyOverflow = '';

  protected toggle(): void {
    this.visible.update((v) => !v);
    const wrapper = this.document.querySelector('#appWrapper');
    const body = this.document.body;

    if (!(wrapper instanceof HTMLElement)) {
      return;
    }

    if (this.visible()) {
      this.previousBodyOverflow = body.style.overflow;
      body.style.overflow = 'hidden';
      gsap.to(wrapper, { right: '80%', duration: 0.5, ease: 'power2.inOut' });
    } else {
      body.style.overflow = this.previousBodyOverflow;
      gsap.to(wrapper, { right: '0%', duration: 0.5, ease: 'power2.inOut' });
    }
  }
}
