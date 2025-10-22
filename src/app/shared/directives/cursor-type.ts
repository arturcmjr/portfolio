import { Directive, input } from '@angular/core';

export type CursorTypes = 'pointer'; // TODO: check adding more types like 'text' is needed;

@Directive({
  selector: '[cursorType]',
  host: {
    '[attr.data-cursor]': 'cursorType()',
  },
})
export class CursorType {
  cursorType = input.required<CursorTypes>();
}
