import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CalendarNewService {
   events = [
    // { id: 11, startAt: new Date(2023, 1, 1, 6, 50).getTime(), endAt: new Date(2023, 1, 1, 7, 10).getTime() },
    {
      id: 1,
      startAt: new Date(2023, 1, 1, 7, 0).getTime(),
      endAt: new Date(2023, 1, 1, 7, 20).getTime(),
    },
    {
      id: 2,
      startAt: new Date(2023, 1, 1, 7, 0).getTime(),
      endAt: new Date(2023, 1, 1, 8, 0).getTime(),
    },
    {
      id: 3,
      startAt: new Date(2023, 1, 1, 7, 10).getTime(),
      endAt: new Date(2023, 1, 1, 7, 30).getTime(),
    },
    {
      id: 4,
      startAt: new Date(2023, 1, 1, 7, 20).getTime(),
      endAt: new Date(2023, 1, 1, 8, 20).getTime(),
    },
    {
      id: 5,
      startAt: new Date(2023, 1, 1, 8, 10).getTime(),
      endAt: new Date(2023, 1, 1, 10, 0).getTime(),
    },
    {
      id: 6,
      startAt: new Date(2023, 1, 1, 8, 10).getTime(),
      endAt: new Date(2023, 1, 1, 8, 40).getTime(),
    },
    {
      id: 7,
      startAt: new Date(2023, 1, 1, 9, 30).getTime(),
      endAt: new Date(2023, 1, 1, 9, 50).getTime(),
    },
    {
      id: 8,
      startAt: new Date(2023, 1, 1, 10, 10).getTime(),
      endAt: new Date(2023, 1, 1, 10, 30).getTime(),
    },
    {
      id: 9,
      startAt: new Date(2023, 1, 1, 10, 40).getTime(),
      endAt: new Date(2023, 1, 1, 11, 0).getTime(),
    },
    {
      id: 10,
      startAt: new Date(2023, 1, 1, 10, 40).getTime(),
      endAt: new Date(2023, 1, 1, 11, 0).getTime(),
    },
    // { id: 2, startAt: new Date(2023, 1, 1, 9, 0).getTime(), endAt: new Date(2023, 1, 1, 21, 0).getTime() },
    // { id: 3, startAt: new Date(2023, 1, 1, 9, 0).getTime(), endAt: new Date(2023, 1, 1, 11, 0).getTime() },
    // { id: 1, startAt: new Date(2023, 1, 1, 8, 0).getTime(), endAt: new Date(2023, 1, 1, 8, 30).getTime() },
    // { id: 4, startAt: new Date(2023, 1, 1, 9, 0).getTime(), endAt: new Date(2023, 1, 1, 11, 0).getTime() },
    // { id: 5, startAt: new Date(2023, 1, 1, 12, 0).getTime(), endAt: new Date(2023, 1, 1, 17, 0).getTime() },
    // { id: 6, startAt: new Date(2023, 1, 1, 16, 0).getTime(), endAt: new Date(2023, 1, 1, 17, 0).getTime() },
    // { id: 7, startAt: new Date(2023, 1, 1, 16, 0).getTime(), endAt: new Date(2023, 1, 1, 17, 0).getTime() },
  ];

   findObjectWithLowestStartAt = (
    objects: Record<string, any>[]
  ): Record<string, any> => {
    return objects.reduce(
      (lowestObject, currentObject) =>
        currentObject['startAt'] < lowestObject['startAt']
          ? currentObject
          : lowestObject,
      objects[0]
    );
  };

   findObjectWithHighestEndAt = (
    objects: Record<string, any>[]
  ): Record<string, any> => {
    return objects.reduce(
      (highestObject, currentObject) =>
        currentObject['endAt'] > highestObject['endAt'] ? currentObject : highestObject,
      objects[0]
    );
  };

   findStartAndEnd = (
    eventsToGoThrough: { id: number; startAt: number; endAt: number }[]
  ): {
    soonestStart: number;
    latestEnd: number;
  } => {
    this.findObjectWithLowestStartAt(eventsToGoThrough);
    let soonestStart: any = this.findObjectWithLowestStartAt(eventsToGoThrough)?.["startAt"];
    let latestEnd = this.findObjectWithHighestEndAt(eventsToGoThrough)?.["endAt"];

    for (let i = 1; i < eventsToGoThrough.length; i++) {
      if (eventsToGoThrough[i].startAt < soonestStart) {
        soonestStart = eventsToGoThrough[i].startAt;
      }
      if (eventsToGoThrough[i].endAt > latestEnd) {
        latestEnd = eventsToGoThrough[i].endAt;
      }
    }

    return { soonestStart, latestEnd };
  };

   getOverlaps = (
    allEventsInSector: any[],
    soonestStart: number,
    latestEnd: number
  ): any => {
    return this.events.filter(
      (e) =>
        !allEventsInSector.includes(e) &&
        e.startAt < latestEnd &&
        e.startAt > soonestStart
    );
  };

  getSectorPeriodAndWidth = (
    eventsInTheLine: any[]
  ): { width: number; startAt: number; endAt: number } => {
    let allEventsInSector = eventsInTheLine;

    // Get overlaps
    let startAndEndForDirectOverlaps = this.findStartAndEnd(allEventsInSector);
    let overlaps = this.getOverlaps(
      allEventsInSector,
      startAndEndForDirectOverlaps.soonestStart,
      startAndEndForDirectOverlaps.latestEnd
    );

    while (overlaps.length > 0) {
      allEventsInSector = [...allEventsInSector, ...overlaps];
      startAndEndForDirectOverlaps = this.findStartAndEnd(allEventsInSector);
      overlaps = this.getOverlaps(
        allEventsInSector,
        startAndEndForDirectOverlaps.soonestStart,
        startAndEndForDirectOverlaps.latestEnd
      );
    }

    const timeRangeForSplitEvents = this.findStartAndEnd(allEventsInSector);
    return {
      startAt: timeRangeForSplitEvents.soonestStart,
      endAt: timeRangeForSplitEvents.latestEnd,
      width: eventsInTheLine.length,
    };
  };

   calculateWidthsForEvents = (): any => {
    // Get 10 minutes frames with number of events "touching them"
    const timeFrame = this.findStartAndEnd(this.events);

    // TODO we need to do a calculation only on slots which have at least 2 events "touching it"
    const diffInMinutes =
      (timeFrame.latestEnd - timeFrame.soonestStart) / 1000 / 60;
    const timesWithNumberOfEvents = [];

    // counts number of events for every 10 minute "line"
    for (let i = 0; i < diffInMinutes / 10; i++) {
      const element = timeFrame.soonestStart + i * 1000 * 60 * 10;
      const numberOfElements = this.events.filter(
        (e) => e.startAt <= element && e.endAt >= element
      ).length;

      timesWithNumberOfEvents.push({
        time: element,
        numberOfElements,
      });
    }
    const sortedTimes = timesWithNumberOfEvents.sort(
      (a, b) => b.numberOfElements - a.numberOfElements
    );

    const sectors: any = [];

    // goes through all times and finds corresponding events
    sortedTimes.map((time) => {
      const eventsInTheLine = this.events.filter(
        (e) => e.startAt <= time.time && e.endAt >= time.time
      );

      // filters out events already in calculated sectors
      const filteredEvents = eventsInTheLine.filter((e) => {
        return !sectors.some((sector: any) => {
          return e.startAt >= sector.startAt && e.endAt <= sector.endAt;
        });
      });

      // if there is more than one event then we calculate sector where they appear
      if (filteredEvents.length > 1) {
        sectors.push(this.getSectorPeriodAndWidth(filteredEvents));
      }
    });

    // add width to events
    return this.events.map((e) => {
      const eventSector = sectors.find(
        (sector: any) => e.startAt >= sector.startAt && e.endAt <= sector.endAt
      );
      return {
        ...e,
        width: `${100 / (eventSector?.width || 1)}%`,
      };
    });
  };

  // console.log(calculateWidthsForEvents());
}
