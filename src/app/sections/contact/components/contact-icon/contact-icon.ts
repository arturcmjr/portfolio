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
  desktopView = input<boolean>(false);
  size = computed(() => (this.desktopView() ? '25px' : '30px'));
  maskUrl = computed(() => `url('${this.src()}')`);
}
