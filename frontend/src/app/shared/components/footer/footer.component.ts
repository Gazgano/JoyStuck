import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { version } from 'package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {

  public faGithub = faGithub;
  public faExternalLinkAlt = faExternalLinkAlt;
  public version = version;
  
  constructor() { }

  ngOnInit() {
  }

}
