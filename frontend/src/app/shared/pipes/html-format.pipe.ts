import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlFormat'
})
export class HtmlFormatPipe implements PipeTransform {

  transform(str: string): any {
    if (!str) {
      return str;
    }
    return str.replace(new RegExp('\n', 'g'), '<br/>');
  }
}
