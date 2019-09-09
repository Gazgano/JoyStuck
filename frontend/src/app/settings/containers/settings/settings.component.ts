import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {

  public selectedScreen: string;
  
  constructor() { }

  select(screen: string) {
    this.selectedScreen = screen;
  }
}
