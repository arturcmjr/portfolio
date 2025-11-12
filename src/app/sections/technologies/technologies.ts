import { Component, signal, WritableSignal } from '@angular/core';
import { ObserveVisibilityDirective } from '@shared/directives/observe-visibility';
import { TechIcon } from './components/tech-icon/tech-icon';

@Component({
  selector: 'app-technologies',
  imports: [ObserveVisibilityDirective, TechIcon],
  templateUrl: './technologies.html',
  styleUrl: './technologies.scss',
})
export class Technologies {
  protected readonly visible: WritableSignal<boolean> = signal(false);

  protected onVisibilityChange(isVisible: boolean): void {
    this.visible.set(isVisible);
  }
}
