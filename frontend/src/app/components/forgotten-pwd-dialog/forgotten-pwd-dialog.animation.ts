import { trigger, style, animate, transition, query, group } from '@angular/animations';

export const stepTransitionTrigger = trigger('stepTransitionTrigger', [
  transition('FORM_FILL => CONFIRMATION', [
    style({ position: 'relative' }),
    query('.ForgottenPwd-Form, .ForgottenPwd-Confirmation', [
      style({
        position: 'absolute',
        top: 0,
        width: '100%'
      })
    ]),
    group([
      query('.ForgottenPwd-Form', [
        style({ left: '0' }),
        animate(200, style({ left: '-100%' }))
      ]),
      query('.ForgottenPwd-Confirmation', [
        style({ left: '100%' }),
        animate(200, style({ left: '0' }))
      ])
    ])
  ])
]);
