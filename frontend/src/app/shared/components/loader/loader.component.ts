import { Component, OnInit, Input } from '@angular/core';
import { Palette } from '@app/core/models/palette.model';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input() palette: Palette;
  
  constructor() { }

  ngOnInit() {
  }

}
