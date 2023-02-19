import { Component } from '@angular/core';
import { CalendarService } from './calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
viewEvents = this.calendarService.getEventsPosition();

constructor (private calendarService: CalendarService) {}
}
