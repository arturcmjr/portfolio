import * as THREE from 'three';

export class SpaceGameScene {
  private readonly scene = new THREE.Scene();
  private readonly renderer: THREE.WebGLRenderer;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly keys = new Set<string>();
  private readonly bullets: THREE.Mesh[] = [];
  private readonly asteroids: THREE.Mesh[] = [];
  private readonly clock = new THREE.Clock();

  private spaceship!: THREE.Group;
  private animationFrameId = 0;
  private cooldown = 0;
  private score = 0;

  constructor(
    canvas: HTMLCanvasElement,
    private readonly onScoreChange: (score: number) => void,
  ) {
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 16);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene.background = new THREE.Color('#020817');
    this.createLighting();
    this.createStarField();
    this.spaceship = this.createSpaceship();
    this.scene.add(this.spaceship);

    this.bindEvents();
    this.startLoop();
  }

  public dispose(): void {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('resize', this.onResize);

    this.renderer.dispose();
  }

  private createLighting(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x7dd3fc, 1.8);
    dirLight.position.set(4, 6, 8);
    this.scene.add(dirLight);
  }

  private createStarField(): void {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 250;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 40;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xe2e8f0,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
    });

    this.scene.add(new THREE.Points(starGeometry, starMaterial));
  }

  private bindEvents(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('resize', this.onResize);
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd', 'A', 'D'].includes(event.key)) {
      event.preventDefault();
    }

    this.keys.add(event.key);
    if (event.key === ' ') {
      this.fireBullet();
    }
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.key);
  };

  private readonly onResize = (): void => {
    if (!this.camera || !this.renderer) {
      return;
    }

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private startLoop(): void {
    const tick = () => {
      const delta = Math.min(this.clock.getDelta(), 0.05);

      this.updateShip(delta);
      this.updateBullets(delta);
      this.updateAsteroids(delta);
      this.handleCollisions();

      this.renderer.render(this.scene, this.camera);
      this.animationFrameId = requestAnimationFrame(tick);
    };

    tick();
  }

  private updateShip(delta: number): void {
    const left = this.keys.has('ArrowLeft') || this.keys.has('a') || this.keys.has('A');
    const right = this.keys.has('ArrowRight') || this.keys.has('d') || this.keys.has('D');

    const moveSpeed = 8;
    if (left) {
      this.spaceship.position.x -= moveSpeed * delta;
    }

    if (right) {
      this.spaceship.position.x += moveSpeed * delta;
    }

    this.spaceship.position.x = THREE.MathUtils.clamp(this.spaceship.position.x, -7.5, 7.5);
    this.spaceship.rotation.z = THREE.MathUtils.lerp(
      this.spaceship.rotation.z,
      left ? 0.45 : right ? -0.45 : 0,
      0.12,
    );
  }

  private fireBullet(): void {
    if (this.cooldown > 0) {
      return;
    }

    const bullet = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        emissive: 0x7dd3fc,
        emissiveIntensity: 0.7,
      }),
    );

    bullet.position.copy(this.spaceship.position);
    bullet.position.y = -4.3;
    bullet.position.z = 0.2;

    this.scene.add(bullet);
    this.bullets.push(bullet);
    this.cooldown = 0.22;
  }

  private updateBullets(delta: number): void {
    this.cooldown = Math.max(0, this.cooldown - delta);

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.position.y += 15 * delta;

      if (bullet.position.y > 8) {
        this.scene.remove(bullet);
        this.bullets.splice(i, 1);
      }
    }
  }

  private updateAsteroids(delta: number): void {
    const spawnChance = 0.018 + delta * 0.55;
    if (Math.random() < spawnChance) {
      const asteroid = this.createAsteroid();
      asteroid.position.set(THREE.MathUtils.randFloatSpread(12), 8.5, 0);
      this.scene.add(asteroid);
      this.asteroids.push(asteroid);
    }

    const baseSpeed = 0.9;
    const scoreBoost = this.score * 0.008;

    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      asteroid.position.y -= (baseSpeed + scoreBoost) * delta * 4.5;
      asteroid.rotation.x += delta * 0.8;
      asteroid.rotation.y += delta * 1.2;

      if (asteroid.position.y < -9) {
        this.scene.remove(asteroid);
        this.asteroids.splice(i, 1);
      }
    }
  }

  private handleCollisions(): void {
    for (let bulletIndex = this.bullets.length - 1; bulletIndex >= 0; bulletIndex--) {
      const bullet = this.bullets[bulletIndex];

      for (let asteroidIndex = this.asteroids.length - 1; asteroidIndex >= 0; asteroidIndex--) {
        const asteroid = this.asteroids[asteroidIndex];
        const distance = bullet.position.distanceTo(asteroid.position);

        if (distance < 1.15) {
          this.scene.remove(bullet);
          this.scene.remove(asteroid);
          this.bullets.splice(bulletIndex, 1);
          this.asteroids.splice(asteroidIndex, 1);
          this.score += 10;
          this.onScoreChange(this.score);
          break;
        }
      }
    }
  }

  private createSpaceship(): THREE.Group {
    const ship = new THREE.Group();

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.2,
      roughness: 0.45,
    });

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 2.8, 6, 12), bodyMaterial);
    body.rotation.z = Math.PI / 2;
    ship.add(body);

    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.35,
      }),
    );
    cockpit.position.set(0, 0.15, 0.45);
    cockpit.scale.set(1.1, 1.2, 1);
    ship.add(cockpit);

    const leftWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 1.4, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x7dd3fc }),
    );
    leftWing.position.set(-1, -0.3, 0);
    ship.add(leftWing);

    const rightWing = leftWing.clone();
    rightWing.position.x = 1;
    ship.add(rightWing);

    const engineGlow = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.7, 12),
      new THREE.MeshStandardMaterial({
        color: 0xfb7185,
        emissive: 0xf97316,
        emissiveIntensity: 1.2,
      }),
    );
    engineGlow.rotation.x = Math.PI;
    engineGlow.position.set(0, -1.7, 0.1);
    ship.add(engineGlow);

    ship.position.set(0, -5.4, 0);
    return ship;
  }

  private createAsteroid(): THREE.Mesh {
    const asteroid = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        flatShading: true,
        roughness: 0.9,
      }),
    );

    const scale = THREE.MathUtils.randFloat(0.7, 1.8);
    asteroid.scale.set(scale, scale, scale);
    asteroid.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    );

    return asteroid;
  }
}
