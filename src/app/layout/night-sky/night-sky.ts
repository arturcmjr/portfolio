import { Component, AfterViewInit, viewChild, input, ElementRef, OnDestroy } from '@angular/core';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
  blinkTimer: number;
  blinkDuration: number;
  isBlinking: boolean;
}

@Component({
  selector: 'app-night-sky',
  imports: [],
  templateUrl: './night-sky.html',
  styleUrl: './night-sky.scss',
  host: {
    '(window:resize)': 'handleResize()'
  }
})
export class NightSkyComponent implements AfterViewInit, OnDestroy {
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  readonly starCount = input<number>(100);
  readonly speed = input<number>(1);

  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private animationId?: number;

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef()!.nativeElement.getContext('2d')!;
    this.resizeCanvas();
    this.createStars();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private createStars() {
    const canvas = this.canvasRef()!.nativeElement;
    this.stars = Array.from({ length: this.starCount() }, () =>
      this.createStar(canvas.width, canvas.height)
    );
  }

  private createStar(canvasWidth: number, canvasHeight: number): Star {
    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 1.2 + 1,
      speed: Math.random() * (this.speed() - 0.5) + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      blinkTimer: Math.random() * 200,
      blinkDuration: 0,
      isBlinking: false,
    };
  }

  protected handleResize(): void {
    const canvas = this.canvasRef()!.nativeElement;
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    this.resizeCanvas();

    const newWidth = canvas.width;
    const newHeight = canvas.height;

    // Recalculate star positions proportionally
    this.stars.forEach((star) => {
      star.x = (star.x / oldWidth) * newWidth;
      star.y = (star.y / oldHeight) * newHeight;
    });

    // Remove stars that are now outside bounds and create new ones if needed
    this.stars = this.stars.filter(
      (star) => star.x >= 0 && star.x <= newWidth && star.y >= 0 && star.y <= newHeight
    );

    // Add new stars if we lost some during resize
    const missingStars = this.starCount() - this.stars.length;
    for (let i = 0; i < missingStars; i++) {
      this.stars.push(this.createStar(newWidth, newHeight));
    }
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef()!.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private animate = (): void => {
    const canvas = this.canvasRef()!.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.stars.forEach((star) => {
      // update blink
      if (star.isBlinking) {
        star.blinkDuration--;
        star.alpha = Math.random() * 0.5 + 0.2;
        if (star.blinkDuration <= 0) {
          star.isBlinking = false;
          star.alpha = Math.random() * 0.8 + 0.2;
          star.blinkTimer = Math.random() * 200 + 100;
        }
      } else {
        star.blinkTimer--;
        if (star.blinkTimer <= 0) {
          star.isBlinking = true;
          star.blinkDuration = Math.floor(Math.random() * 20 + 10);
        }
      }

      // draw star
      this.ctx.fillStyle = `rgba(110, 110, 110, ${star.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();

      // move star downward
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
        star.speed = Math.random() * (this.speed() - 0.5) + 0.5;
      }
    });

    this.animationId = requestAnimationFrame(this.animate);
  };
}
