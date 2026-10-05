import { Component, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faGamepad } from '@fortawesome/free-solid-svg-icons';

@Component({
  imports: [FaIconComponent],
  selector: 'app-game-button',
  styleUrl: './game-button.scss',
  templateUrl: './game-button.html',
  host: {
    class: 'glass'
  }
})
export class GameButton {
  protected readonly faGamepad = faGamepad;
  protected readonly faArrowLeft = faArrowLeft;

  readonly isGameMode = input(false);
  readonly toggleGame = output<void>();

  protected onClick(): void {
    this.toggleGame.emit();
  }
}
