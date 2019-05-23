import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const posts = [
      { id: 11, title: 'Imbibed veut nous faire découvrir un jeu', type: 'gameDiscover', content: 'Duis sunt tempor culpa est duis qui aliquip tempor mollit. Esse ad minim dolor ea ex culpa laborum. Anim sit sunt in incididunt mollit et culpa ex velit. Fugiat excepteur quis nisi ea occaecat incididunt. Magna excepteur eiusmod sunt dolore ut elit ea dolor Lorem quis anim.' },
      { id: 12, title: 'Nini a partagé une capture d\'écran', type: 'screenshotShare', content: 'Amet minim do dolor sit. Ut non incididunt quis culpa id officia velit. Esse est proident aute excepteur minim nulla laboris. Esse veniam fugiat nostrud adipisicing. Aute occaecat eu labore laboris est enim dolor ex adipisicing aliqua esse.' }
    ];
    return { posts };
  }
}