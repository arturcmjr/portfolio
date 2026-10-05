import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';
import { SpaceGameScene } from './space-game-scene';

@Component({
  selector: 'app-space-game',
  standalone: true,
  template: `
    <div class="space-game">
      <canvas #gameCanvas aria-label="Space shooter game"></canvas>

      <div class="hud">
        <div class="score-panel glass">
          <span>Score</span>
          <strong>{{ score() }}</strong>
        </div>
      </div>
    </div>
  `,
  styleUrl: './space-game.scss',
})
export class SpaceGameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas') private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  protected readonly score = signal(0);

  private scene?: SpaceGameScene;

  ngAfterViewInit(): void {
    this.scene = new SpaceGameScene(this.canvasRef.nativeElement, (nextScore) => {
      this.score.set(nextScore);
    });
  }

  ngOnDestroy(): void {
    this.scene?.dispose();
  }
}
