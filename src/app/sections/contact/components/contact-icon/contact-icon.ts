import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-contact-icon',
  imports: [],
  templateUrl: './contact-icon.html',
  styleUrl: './contact-icon.scss',
})
export class ContactIcon {
  label = input.required<string>();
  src = input.required<string>();
  showLabel = input<boolean>(false);
  size = input<string>('24px');
  maskUrl = computed(() => `url('${this.src()}')`);
}
