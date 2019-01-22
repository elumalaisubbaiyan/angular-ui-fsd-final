import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityFilter'
})
export class PriorityFilterPipe implements PipeTransform {

  transform(values: any, rangeStart: any, rangeEnd: any): any {
    if (!rangeStart) {
      rangeStart = 1;
    } if (!rangeEnd) {
      rangeEnd = 30;
    }
    console.log("Range from >> " + rangeStart + " to " + rangeEnd);
    return values.filter(function (value) {
      if (!value.priority) {
        return value;
      }
      if (value.priority >= rangeStart && value.priority <= rangeEnd) {
        return value;
      }
    });
  }

}
