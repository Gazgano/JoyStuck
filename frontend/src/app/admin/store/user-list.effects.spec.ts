import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { UserListEffects } from './user-list.effects';

describe('UserListEffects', () => {
  let actions$: Observable<any>;
  let effects: UserListEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserListEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(UserListEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
