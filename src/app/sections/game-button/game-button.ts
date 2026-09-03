import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';

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
}
