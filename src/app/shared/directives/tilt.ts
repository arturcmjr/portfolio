import { Directive, ElementRef, signal, inject } from '@angular/core';

interface Position {
  x: number;
  y: number;
}

@Directive({
  selector: '[appTilt]',
  host: {
    '(mousemove)': 'onMouseMove($event)',
    '(mouseleave)': 'onMouseLeave()',
    '(mouseenter)': 'onMouseEnter()'
  }
})
export class Tilt {
  private readonly el = inject(ElementRef<HTMLElement>);
  private requestId: number | null = null;
  private overlay: HTMLElement | null = null;

  private readonly targetRotation = signal<Position>({ x: 0, y: 0 });
  private readonly currentRotation = signal<Position>({ x: 0, y: 0 });
  private readonly maxTilt = 12;
  
  // Static light source - top-left position
  private readonly lightSource = { x: 30, y: 20 };

  constructor() {
    this.setupElement();
  }

  private setupElement(): void {
    const element = this.el.nativeElement;
    
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }
    
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.3s ease;
      mix-blend-mode: overlay;
    `;
    
    element.appendChild(this.overlay);
    this.updateStaticLighting(0, 0);
  }

  onMouseEnter(): void {
    if (this.overlay) {
      this.overlay.style.opacity = '1';
    }
  }

  onMouseMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normalizedX = centerX === 0 ? 0 : (x - centerX) / centerX;
    const normalizedY = centerY === 0 ? 0 : (y - centerY) / centerY;

    const clampedX = Math.max(-1, Math.min(1, normalizedX));
    const clampedY = Math.max(-1, Math.min(1, normalizedY));

    this.targetRotation.set({
      x: clampedY * -this.maxTilt,
      y: clampedX * this.maxTilt,
    });

    if (!this.requestId) {
      this.animate();
    }
  }

  private animate(): void {
    this.requestId = requestAnimationFrame(() => this.animate());

    const targetRot = this.targetRotation();
    const currentRot = this.currentRotation();

    const newRotX = currentRot.x + (targetRot.x - currentRot.x) * 0.1;
    const newRotY = currentRot.y + (targetRot.y - currentRot.y) * 0.1;

    this.currentRotation.set({ x: newRotX, y: newRotY });

    const element = this.el.nativeElement;
    element.style.transform = `
      perspective(1000px) 
      rotateX(${newRotX}deg) 
      rotateY(${newRotY}deg)
      translateZ(20px)
    `;

    // Update lighting based on rotation to simulate static light source
    this.updateStaticLighting(newRotX, newRotY);

    if (
      Math.abs(targetRot.x - newRotX) < 0.01 &&
      Math.abs(targetRot.y - newRotY) < 0.01
    ) {
      if (this.requestId) {
        cancelAnimationFrame(this.requestId);
        this.requestId = null;
      }
    }
  }

  private updateStaticLighting(rotX: number, rotY: number): void {
    if (!this.overlay) return;

    // Calculate how the static light appears to move as the card rotates
    const lightX = this.lightSource.x + (rotY * 0.8);
    const lightY = this.lightSource.y - (rotX * 0.8);
    
    // Calculate light intensity based on angle to light source
    const intensity = this.calculateLightIntensity(rotX, rotY);
    
    this.overlay.style.background = `
      radial-gradient(
        circle at ${lightX}% ${lightY}%,
        rgba(255, 255, 255, ${0.15 * intensity}) 0%,
        rgba(255, 255, 255, ${0.08 * intensity}) 25%,
        rgba(255, 255, 255, ${0.03 * intensity}) 50%,
        rgba(0, 0, 0, ${0.15 * (1 - intensity * 0.5)}) 100%
      )
    `;
  }

  private calculateLightIntensity(rotX: number, rotY: number): number {
    // Calculate angle between surface normal and light direction
    const normalizedRotX = rotX / 30; // Normalize rotation
    const normalizedRotY = rotY / 30;
    
    // Light direction vector (from top-left)
    const lightDir = { x: -0.5, y: -0.7 };
    
    // Surface normal based on rotation
    const surfaceNormal = {
      x: Math.sin(normalizedRotY * Math.PI / 180),
      y: Math.sin(normalizedRotX * Math.PI / 180),
      z: Math.cos(Math.sqrt(normalizedRotX * normalizedRotX + normalizedRotY * normalizedRotY) * Math.PI / 180)
    };
    
    // Dot product for light intensity (clamped between 0.3 and 1)
    const dotProduct = lightDir.x * surfaceNormal.x + lightDir.y * surfaceNormal.y + 0.8 * surfaceNormal.z;
    return Math.max(0.3, Math.min(1, (dotProduct + 1) / 2));
  }

  onMouseLeave(): void {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }

    const element = this.el.nativeElement;
    element.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)';
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';

    if (this.overlay) {
      this.overlay.style.opacity = '0';
    }

    this.currentRotation.set({ x: 0, y: 0 });
    this.updateStaticLighting(0, 0);

    setTimeout(() => {
      element.style.transition = '';
    }, 600);
  }
}