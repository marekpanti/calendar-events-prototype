import { Component } from '@angular/core';
import { CalendarService } from './calendar.service';
import { CalendarNewService } from './calendarNew.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
viewEvents = this.calendarService.getEventsPosition();

constructor (private calendarService: CalendarService, private newCalendarService: CalendarNewService) {}

ngOnInit() {
  console.log(this.newCalendarService.calculateWidthsForEvents());
}
}
