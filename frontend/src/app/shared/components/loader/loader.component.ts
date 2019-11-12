import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Palette } from '@app/core/models/palette.model';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit {

  @Input() palette: Palette;
  
  constructor() { }

  ngOnInit() {
  }

}
