import { state, transition, animate, style, trigger } from '@angular/animations';

export const buttonConfirmationTrigger = trigger('buttonConfirmation', [
  state('false', style({
    width: '64px' // we need to specify an initial width for the animation to work
  })),
  state('true', style({
    width: '*'
  })),
  transition('* => true', [
    animate('100ms')
  ])
]);
