import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercaseFirstLetter'
})
export class UppercaseFirstLetterPipe implements PipeTransform {

  transform(str: string): string {
    if (str === '') {
      return '';
    } else if (!str) {
      return null;
    } else {
      return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
  }
}
