import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercaseFirstLetter'
})
export class UppercaseFirstLetterPipe implements PipeTransform {

  transform(str: string): string {
    if (str === null) {
      return null;
    } else if (str === '') {
      return '';
    } else {
      return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
  }
}
