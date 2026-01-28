import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionHeader } from 'app/layout/section-header/section-header';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.scss',
  imports: [SectionHeader],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class About {
  timelineItems: TimelineItem[] = [
    {
      date: '2017',
      title: 'Senior Frontend Developer',
      description: 'Leading frontend architecture and implementation for enterprise SaaS platform using Angular and TypeScript.'
    },
    {
      date: '2021 - 2023',
      title: 'Full Stack Developer',
      description: 'Built and maintained web applications with Angular frontend and .NET backend, focusing on performance optimization.'
    },
    {
      date: '2019 - 2021',
      title: 'Frontend Developer',
      description: 'Developed responsive web applications and implemented modern UI/UX designs with Angular and CSS.'
    },
    {
      date: '2018 - 2019',
      title: 'Junior Web Developer',
      description: 'Started career in web development, working with various frontend technologies and learning best practices.'
    },
    {
      date: '2017 - 2018',
      title: 'Software Developer',
      description: 'General software development experience working on desktop and web applications.'
    }
  ];
}