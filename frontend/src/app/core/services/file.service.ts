import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FileSizePipe } from '@app/shared/pipes/file-size.pipe';
import { Observable, Subscriber } from 'rxjs';

export interface FilePropertyControls {
  typePattern?: {
    [Symbol.match](str: string): RegExpMatchArray;
  };
  maxSizeInBytes?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private matSnackBar: MatSnackBar) { }

  controlFiles(file: File, controls: FilePropertyControls): boolean {
    // format control
    if (controls.typePattern && file.type.match(controls.typePattern) == null) {
      this.matSnackBar.open(`Format of the file '${file.name}' is not supported`, 'Dismiss', { duration: 5000 });
      return false;
    }

    // size control
    if (controls.maxSizeInBytes && file.size >= controls.maxSizeInBytes) {
      this.matSnackBar.open(
        `'${file.name}' is too big. Maximum size is ${new FileSizePipe().transform(controls.maxSizeInBytes)}`,
        'Dismiss',
        { duration: 5000 }
      );
      return false;
    }

    return true;
  }

  readAndGetFileURL(file: File) {
    return new Observable<string>((subscriber: Subscriber<string>) => {
      const reader = new FileReader();

      reader.onloadend = event => {
        subscriber.next(reader.result as string);
        subscriber.complete();
      };
      reader.onerror = error => subscriber.error(error);

      reader.readAsDataURL(file);
    });
  }

  imageFromURL(url: string) {
    return new Observable<HTMLImageElement>((subscriber: Subscriber<HTMLImageElement>) => {
      const img = new Image();

      img.onload = () => {
        subscriber.next(img);
        subscriber.complete();
      };
      img.onerror = error => subscriber.error(error);

      img.src = url;
    });
  }
}
