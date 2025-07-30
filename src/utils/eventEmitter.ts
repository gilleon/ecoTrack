type EventListener = () => void;

class EventEmitter {
  private listeners: Record<string, EventListener[]> = {};

  on(event: string, listener: EventListener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
    
    return () => {
      this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    };
  }

  emit(event: string) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => {
        try {
          listener();
        } catch (error) {
          console.error('Event listener error:', error);
        }
      });
    }
  }

  off(event: string, listener?: EventListener) {
    if (!this.listeners[event]) return;
    
    if (listener) {
      this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    } else {
      delete this.listeners[event];
    }
  }

  removeAllListeners() {
    this.listeners = {};
  }
}

export const eventEmitter = new EventEmitter();

export const EVENTS = {
  ACTION_LOGGED: 'action_logged',
  TRIP_UPDATED: 'trip_updated',
} as const;