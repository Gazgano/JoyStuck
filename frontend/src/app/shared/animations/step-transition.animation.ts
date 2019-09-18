import { trigger, style, animate, transition, query, group } from '@angular/animations';

export function stepTransition(
  triggerName: string,
  direction: 'left' | 'right',
  transitionSelector: string, 
  leavingChildSelector: string, 
  enteringChildSelector: string,
  animationDuration: number = 200
) {
  return trigger(triggerName, [
    transition(transitionSelector, [
      style({ position: 'relative' }), // parent initial style
      query(`${leavingChildSelector}, ${enteringChildSelector}`, [
        style({ position: 'absolute', top: 0, width: '100%' }) // common children style
      ]),
      group([
        query(leavingChildSelector, [
          style({ left: '0' }),
          animate(animationDuration, style({ left: direction === 'right'? '-100%' : '100%' }))
        ]),
        query(enteringChildSelector, [
          style({ left: direction === 'right'? '100%' : '-100%' }),
          animate(animationDuration, style({ left: '0' }))
        ])
      ])
    ])
  ]);
}
