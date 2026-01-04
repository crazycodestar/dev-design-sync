export function assertIsWheelEvent(event: Event): asserts event is WheelEvent {
  if (!(event instanceof WheelEvent)) {
    throw new Error("Event is not a WheelEvent");
  }
}
