export function isMobileDevice(): boolean {
  return /Mobi|Android/i.test(navigator.userAgent);
}

export function hasFinePointerAndHover(): boolean {
  const hasFinePointer = window.matchMedia?.('(any-pointer: fine)')?.matches ?? false;
  const hasHover = window.matchMedia?.('(any-hover: hover)')?.matches ?? false;
  return hasFinePointer && hasHover;
}