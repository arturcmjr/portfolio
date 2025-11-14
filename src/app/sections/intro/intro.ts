import { AfterViewInit, Component, output } from '@angular/core';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(SplitText, TextPlugin);

@Component({
  selector: 'app-intro',
  imports: [],
  templateUrl: './intro.html',
  styleUrl: './intro.scss',
})
export class Intro implements AfterViewInit {
  readonly introFinished = output<void>();

  ngAfterViewInit(): void {
    // TODO: wait for fonts to load
    // TODO: remove it after testing
    this.introFinished.emit();
    return;

    const mainTl = gsap.timeline();
    mainTl.add(this.getGreetingsAnimation());
    mainTl.add(this.getNameAnimation(), '+=0.3');
    mainTl.add(this.getMainTextAnimation(), '+=0.2');
    mainTl.add(this.getPictureAnimation(), '+=0.2');
    mainTl.call(() => {
      this.introFinished.emit();
    });
  }

  private getGreetingsAnimation() {
    const tl = gsap.timeline();
    const greetingsSplit = new SplitText('div .greetings', {
      type: 'words',
    });

    const words = greetingsSplit.words;
    words.forEach((word) => {
      tl.fromTo(
        word,
        { opacity: 0, scale: 10, y: 100, duration: 0.02 },
        { opacity: 1, duration: 0.4 }
      ).to(word, { scale: 1, y: 0, duration: 0.3, ease: 'power3.out' });
    });

    return tl;
  }

  private getNameAnimation() {
    const tl = gsap.timeline();
    const nameString = 'Artur';
    const nameElement = document.querySelector('div .name') as HTMLElement;
    nameElement.innerHTML = '';
    tl.to(nameElement, {
      text: { value: nameString },
      duration: 1,
      ease: 'none',
    });
    return tl;
  }

  private getMainTextAnimation() {
    const tl = gsap.timeline();
    const mainTextElement = document.querySelector('.main-text') as HTMLElement;
    const textSplit = new SplitText(mainTextElement, { type: 'words' });
    const words = textSplit.words;
    tl.fromTo(
      words,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.05,
      }
    );
    return tl;
  }

  private getPictureAnimation() {
    const tl = gsap.timeline();
    const image = document.querySelector('.about img') as HTMLElement;
    tl.fromTo(
      image,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }
    );
    return tl;
  }
}
