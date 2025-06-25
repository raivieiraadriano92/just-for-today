import EventEmitter from "eventemitter3";

type AppEvents = {
  "intention:created": null;
  "intention:updated": null;
  "intention:deleted": null;
  "moodLog:created": null;
  "moodLog:updated": null;
  "moodLog:deleted": null;
  "gratitudeLog:created": null;
  "gratitudeLog:updated": null;
  "gratitudeLog:deleted": null;
  "reflection:created": null;
  "reflection:updated": null;
  "reflection:deleted": null;
};

export type EventKey = keyof AppEvents;

type Handler<K extends EventKey> = (payload: AppEvents[K]) => void;

const eventEmitter = new EventEmitter();

export const Emitter = {
  on<K extends EventKey>(event: K, handler: Handler<K>) {
    eventEmitter.on(event, handler);
  },

  off<K extends EventKey>(event: K, handler: Handler<K>) {
    eventEmitter.off(event, handler);
  },

  emit<K extends EventKey>(event: K, payload?: AppEvents[K]) {
    eventEmitter.emit(event, payload);
  },

  onMany<K extends EventKey>(
    events: K[],
    handler: (event: K, payload: AppEvents[K]) => void,
  ) {
    events.forEach((event) => {
      eventEmitter.on(event, (payload) => handler(event, payload));
    });
  },

  offMany<K extends EventKey>(
    events: K[],
    handler: (event: K, payload: AppEvents[K]) => void,
  ) {
    events.forEach((event) => {
      const wrapper = (payload: AppEvents[K]) => handler(event, payload);
      eventEmitter.off(event, wrapper);
    });
  },
};
