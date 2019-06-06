import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const posts = [
      { 
        id: 11, 
        timestamp: moment().subtract(5, 'minute'),
        type: 'gameDiscover', 
        authorName: 'Imbibed',
        title: 'Imbibed veut nous faire découvrir un jeu', 
        likesCount: 3,
        content: 'Duis sunt tempor culpa est duis qui aliquip tempor mollit. Esse ad minim dolor ea ex culpa laborum. Anim sit sunt in incididunt mollit et culpa ex velit. Fugiat excepteur quis nisi ea occaecat incididunt. Magna excepteur eiusmod sunt dolore ut elit ea dolor Lorem quis anim.' 
      },
      {
        id: 12,
        timestamp: moment().subtract(10, 'minute'),
        type: 'newMember',
        authorName: 'system',
        title: 'ClemDOT vient de rejoindre le serveur. Bienvenue à lui !',
        likesCount: 3
      },
      { 
        id: 13, 
        timestamp: moment().subtract(2, 'hour'),
        type: 'screenshotShare', 
        authorName: 'Nini',
        title: 'Nini a partagé une capture d\'écran', 
        likesCount: 0,
        content: 'Amet minim do dolor sit. Ut non incididunt quis culpa id officia velit. Esse est proident aute excepteur minim nulla laboris. Esse veniam fugiat nostrud adipisicing. Aute occaecat eu labore laboris est enim dolor ex adipisicing aliqua esse.' 
      }
    ];

    const comments = [
      {
        post_id: 11,
        authorName: 'Gazagno',
        timestamp: moment().subtract(4, 'minute'),
        content: 'Ouais ça m\'a l\'air pas mal !',
        likesCount: 1
      },
      {
        post_id: 12,
        authorName: 'Imbibed',
        timestamp: moment().subtract(78, 'minute'),
        content: 'ruir',
        likesCount: 3
      },
      {
        post_id: 12,
        authorName: 'Gazgano',
        timestamp: moment().subtract(47, 'minute'),
        content: 'Occaecat minim laborum',
        likesCount: 0
      },
      {
        post_id: 13,
        authorName: 'Imbibed',
        timestamp: moment().subtract(78, 'minute'),
        content: 'ruir',
        likesCount: 12
      },
      {
        post_id: 13,
        authorName: 'Gazgano',
        timestamp: moment().subtract(47, 'minute'),
        content: 'Occaecat minim laborum dolor proident reprehenderit ipsum esse non laborum. Velit id tempor aliquip reprehenderit exercitation velit. Amet ad eiusmod esse est. Magna in Lorem velit sunt veniam incididunt eu ipsum sit. Ipsum tempor aliqua velit reprehenderit ipsum dolore do cillum dolore sunt laboris aute sunt. Fugiat enim minim sunt anim dolore.',
        likesCount: 0
      }
    ];

    return { posts, comments };
  }
}