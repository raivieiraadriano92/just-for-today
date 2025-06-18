import EventEmitter from "eventemitter3";

type ChangeType = "insert" | "update" | "delete";

type AppEvents = {
  "intention:changed": { type: ChangeType };
  "mood:changed": { type: ChangeType };
  "gratitude:changed": { type: ChangeType };
  "reflection:changed": { type: ChangeType };
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

  emit<K extends EventKey>(event: K, payload: AppEvents[K]) {
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
