import { InjectionToken } from "@angular/core";

import { environment } from 'src/environments/environment';

export const BASE_URL = new InjectionToken<string>('BaseUrl', {
    providedIn: 'root',
    factory: () => environment.production?
        'https://us-central1-joystuck.cloudfunctions.net/api/':
        'http://localhost:5000/joystuck/us-central1/api/'
});

