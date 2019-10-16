import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

import { Logger } from '@app/core/services/logger.service';
import { AuthService } from '@app/core/services/auth.service';

const log = new Logger('AppComponent');

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD5KB5NePsWDsUXMqIic1dldav1W3jblyw',
  authDomain: 'joystuck.firebaseapp.com',
  databaseURL: 'https://joystuck.firebaseio.com',
  projectId: 'joystuck',
  storageBucket: 'joystuck.appspot.com',
  messagingSenderId: '612325519517',
  appId: '1:612325519517:web:e0a724f26bad259b'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    firebase.initializeApp(firebaseConfig);
    this.authService.initializeAuth();
  }
}
