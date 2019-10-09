import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(size: number): string {
    const GB = Math.pow(2, 30);
    const MB = Math.pow(2, 20);
    const kB = Math.pow(2, 10);
    
    if (size >= 2*GB) {
      return Math.round(size / GB) + ' GB';
    } else if (size >= 2*MB) {
      return Math.round(size / MB) + ' MB';
    } else {
      return Math.round(size / kB) + ' kB';
    }
  }
}
