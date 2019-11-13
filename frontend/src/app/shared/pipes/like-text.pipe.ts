import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'lodash';

import { FirebaseUser } from '@app/home/models/firebase-user.model';

@Pipe({
  name: 'likeText'
})
export class LikeTextPipe implements PipeTransform {

  transform(likes: FirebaseUser[]): string | null {
    if (!likes || !isArray(likes) || likes.length === 0) {
      return null;
    }
    const names = likes.map(l => l.displayName);
    
    let namesConcat: string;
    const maxNamesDisplayed = 3;
    if (names.length > maxNamesDisplayed) {
      namesConcat = `${names.slice(0, maxNamesDisplayed).join(', ')} and ${names.length - maxNamesDisplayed} other people`;
    }
    else if (names.length > 1) {
      namesConcat = names.slice(0, -1).join(', ') + ' and ' + names[names.length-1];
    } else {
      namesConcat = names[0];
    }
    
    return namesConcat + ' liked that.';
  }

}
