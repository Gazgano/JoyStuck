import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-checklist-item',
  templateUrl: './checklist-item.component.html',
  styleUrls: ['./checklist-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChecklistItemComponent {

  @Input() condition: boolean;
  @Input() textIfTrue: string;
  @Input() textIfFalse: string;
  
  constructor() { }

}
