import { trigger, state, style, animate, transition } from '@angular/animations';

export const openCloseTrigger = trigger('openClose', [
  state('open', style({
    height: '*',
  })),
  state('closed', style({
    borderColor: 'rgba(0, 0, 0, 0)',
    height: '0',
    padding: '0'
  })),
  transition(':enter', [
    style({borderColor: 'rgba(0, 0, 0, 0)', height: '0', padding: '0'}),
    animate('200ms')
  ]),
  transition('* => closed', [
    animate('200ms')
  ]),
  transition('* => open', [
    animate('200ms')
  ])
]);
