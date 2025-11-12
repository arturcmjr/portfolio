import { Component, signal, WritableSignal } from '@angular/core';
import { ObserveVisibilityDirective } from '@shared/directives/observe-visibility';

@Component({
  selector: 'app-technologies',
  imports: [ObserveVisibilityDirective],
  templateUrl: './technologies.html',
  styleUrl: './technologies.scss',
})
export class Technologies {
  protected readonly visible: WritableSignal<boolean> = signal(false);

  protected onVisibilityChange(isVisible: boolean): void {
    this.visible.set(isVisible);
  }
}
