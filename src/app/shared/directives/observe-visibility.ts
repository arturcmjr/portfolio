import { Directive, ElementRef, OnInit, OnDestroy, output, input, inject } from '@angular/core';

@Directive({
  selector: '[observeVisibility]',
})
export class ObserveVisibilityDirective implements OnInit, OnDestroy {
  readonly visibilityChange = output<boolean>();
  readonly threshold = input<number>(0.1); // Trigger when 10% of element is visible
  readonly rootMargin = input<string>('200px'); // Trigger 100px before element enters viewport

  private elementRef = inject(ElementRef);
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.visibilityChange.emit(entry.isIntersecting);
      });
    }, {
      threshold: this.threshold(),
      rootMargin: this.rootMargin() 
    });
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}