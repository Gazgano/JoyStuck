import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import * as firebase from 'firebase/app';

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBGEtojvCF9mRTVFcPvbFDx6A56VPCUBw4',
  authDomain: 'joystuck.firebaseapp.com',
  databaseURL: 'https://joystuck.firebaseio.com',
  projectId: 'joystuck',
  storageBucket: '',
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
    this.authService.populate();
  }
}
