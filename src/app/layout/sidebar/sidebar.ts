import { Component, ElementRef, inject, signal } from '@angular/core';
import { gsap } from 'gsap/gsap-core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly visible = signal(false);
  private readonly elementRef = inject(ElementRef);

  protected toggle(): void {
    console.log('Toggling sidebar visibility');
    this.visible.update((v) => !v);
    if (this.visible()) {
      gsap.to(this.elementRef.nativeElement, {
        height: '100%',
        width: '80%',
        duration: 0.15,
        right: 0,
        top: 0,
      });
    } else {
      gsap.to(this.elementRef.nativeElement, {
        height: '50px',
        width: '50px',
        right: '1rem',
        top: '1rem',
        duration: 0.15,
      });
    }
  }
}
