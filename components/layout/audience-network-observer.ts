type Measure = (area: DOMRect) => void;
type Subscription = { targets: Element[]; measure: Measure };

const observers = new WeakMap<Element, ReturnType<typeof createObserver>>();

function createObserver(fan: Element) {
  const subscriptions = new Set<Subscription>();
  let frame = 0;
  let settleTimer = 0;
  let disposed = false;
  const measure = () => {
    if (disposed) return;
    const area = fan.getBoundingClientRect();
    subscriptions.forEach((entry) => entry.measure(area));
  };
  const schedule = () => {
    if (disposed) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(measure);
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(measure, 150);
  };
  const observer = new ResizeObserver(schedule);
  observer.observe(fan);
  window.addEventListener("resize", schedule);
  window.visualViewport?.addEventListener("resize", schedule);
  void document.fonts.ready.then(schedule);

  return {
    subscribe(entry: Subscription) {
      subscriptions.add(entry);
      entry.targets.forEach((target) => observer.observe(target));
      schedule();
      return () => {
        subscriptions.delete(entry);
        entry.targets.forEach((target) => observer.unobserve(target));
        if (subscriptions.size) return;
        disposed = true;
        cancelAnimationFrame(frame);
        window.clearTimeout(settleTimer);
        observer.disconnect();
        window.removeEventListener("resize", schedule);
        window.visualViewport?.removeEventListener("resize", schedule);
        observers.delete(fan);
      };
    },
  };
}

/** One layout read and observer/scheduler per fan, shared by all three panels. */
export function observeAudienceNetwork(fan: Element, targets: Element[], measure: Measure) {
  let observer = observers.get(fan);
  if (!observer) {
    observer = createObserver(fan);
    observers.set(fan, observer);
  }
  return observer.subscribe({ targets, measure });
}
