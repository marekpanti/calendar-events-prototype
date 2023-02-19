import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  convertedEventsInTimeline: any;

  calcEventOffsetTop(event: any) {
    console.log(new Date(event.start).getHours())
    const start = new Date(event.start).getHours();
    console.log(start)
    const offset = this.round((start) * 50, 1);
    return offset + 'px';
  }

  round(value: number, precision: number) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  calcEventHeight(event: any) {
    const start =
      new Date(event.start).getHours() +
      new Date(event.start).getMinutes() / 60;
    const end =
      new Date(event.end).getHours() + new Date(event.end).getMinutes() / 60;
    const percentage = (end - start) / 24;
    const totalHeight = 23 * 52;
    const height = this.round(percentage * totalHeight, 0);
    return height + 'px';
  }

  doesOverlap(eventA: any, eventB: any) {
    const eventAstart = eventA.start.getTime();
    const eventAend = eventA.end.getTime();
    const eventBstart = eventB.start.getTime();
    const eventBend = eventB.end.getTime();

    return eventAstart < eventBend && eventBstart < eventAend;
  }

  getEventsPosition() {
    const overlappingEvents: any[] = [];
    // shallow copy needed so we won't mutate the original object
    this.convertedEventsInTimeline = dummyEvents.map((a) => Object.assign({}, a));
    // sort all events by start
    this.convertedEventsInTimeline.sort((a: any, b: any) => {
      if (a.start.getTime() > b.start.getTime()) return 1;
      return -1;
    });

    // start checking events for collisions
    this.convertedEventsInTimeline.forEach((event: any) => {
      let collisionCounter = 0;
      const collisions: any[] = [];

      event.meta = { ...event.meta, top: this.calcEventOffsetTop(event), height: this.calcEventHeight(event) };
      if (!event.meta.width) {
        event.meta = { ...event.meta, width: 0, left: 0 };
      }

      // Comparing next events with our selected pointer
      for (let j = 0; j < this.convertedEventsInTimeline.length; j++) {
        if (
          this.doesOverlap(event, this.convertedEventsInTimeline[j]) &&
          event.id !== this.convertedEventsInTimeline[j].id
        ) {
          collisionCounter += 1;
          // Creating
          collisions.push(this.convertedEventsInTimeline[j]);
        }
      }
      overlappingEvents.push({ collisions: collisionCounter, id: event.id, collisionEvents: collisions });
    });

    overlappingEvents.sort((a, b) => {
      if (a.collisions < b.collisions) return 1;
      return -1;
    });


    // set width and left to our events
    if (overlappingEvents) {
      // iterate the overlappingEvents
      overlappingEvents.forEach((overlappingGroup) => {
        let maxWidth = 1;
        let leftOffsetCounter = 0;
        const outterIndex = this.convertedEventsInTimeline.findIndex((e: any) => e.id === overlappingGroup.id);
        // Iterate inner cycle only if width is not set, otherwise we are done
        if (this.convertedEventsInTimeline[outterIndex].meta.width === 0) {
          console.log('ziadna sirka');
          // firstly find the max inner collisions
          overlappingGroup.collisionEvents.forEach((overlappedEvent: any) => {
            const index = this.convertedEventsInTimeline.findIndex((e: any) => e.id === overlappedEvent.id);
            if (maxWidth < overlappingEvents[index].collisions) {
              maxWidth = overlappingEvents[index].collisions;
            }
          });
          // set the width for outter Cycle event
          const index = this.convertedEventsInTimeline.findIndex((e: any) => e.id === overlappingGroup.id);
          this.convertedEventsInTimeline[index].meta.width = maxWidth + 1;

          // set width for all collisions inside main, start positioning
          overlappingGroup.collisionEvents.forEach((overlappedEvent: any) => {
            const innerIndex = this.convertedEventsInTimeline.findIndex((e: any) => e.id === overlappedEvent.id);
            this.convertedEventsInTimeline[innerIndex].meta.width = maxWidth + 1;
            // start the positioning, from left, if it reaches maxWidth, it means
            // that the next interval is bigger, so it can be glued to parent
            if (leftOffsetCounter <= maxWidth) {
              leftOffsetCounter += 1;
            } else {
              leftOffsetCounter = 1;
            }
            this.convertedEventsInTimeline[innerIndex].meta.left = leftOffsetCounter;
          });
        }

        // make sure if there are no collisions to set width to 100%
        if (overlappingGroup.collisions === 0) {
          this.convertedEventsInTimeline[outterIndex].meta.width = 1;
        }
      });
    }
    return this.convertedEventsInTimeline;
  }
}

export const dummyEvents = [
  {
    start: new Date(new Date().setHours(8)),
    end: new Date(new Date().setHours(20)),
    id: 1,
    meta: {}
  },
  {
    start: new Date(new Date().setHours(8)),
    end: new Date(new Date().setHours(10)),
    id: 2,
    meta: {}
  },
  {
    start: new Date(new Date().setHours(8)),
    end: new Date(new Date().setHours(10)),
    id: 3,
    meta: {}
  },
  {
    start: new Date(new Date().setHours(11)),
    end: new Date(new Date().setHours(16)),
    id: 4,
    meta: {}
  },
  {
    start: new Date(new Date().setHours(15)),
    end: new Date(new Date().setHours(16)),
    id: 5,
    meta: {}
  },
  {
    start: new Date(new Date().setHours(15)),
    end: new Date(new Date().setHours(16)),
    id: 6,
    meta: {}
  },
];
