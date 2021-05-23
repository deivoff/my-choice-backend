import { ID, objectIdToString } from 'src/common/scalars/objectId.scalar';

const timeouts: Record<string, Map<string, NodeJS.Timeout>> = {};
const timeoutsStart = new Map<NodeJS.Timeout, number>();

type SetTimeoutParams = Parameters<typeof setTimeout>;

const getTimeout = (name: string) => {
  if (!timeouts[name]) {
    timeouts[name] = new Map<string, NodeJS.Timeout>()
  }

  return (_id: ID) => {
    const stringId = objectIdToString(_id);

    const clear = () => {
      const timeoutId = timeouts[name].get(stringId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutsStart.delete(timeoutId);
      }

      timeouts[name].delete(stringId);
    };

    return ({
      get: () => {
        return timeouts[name].get(stringId);
      },
      set: (callback: SetTimeoutParams[0], delay: SetTimeoutParams[1] ) => {
        clear();
        const timeoutId = setTimeout(async () => {
          callback();
          clear();
        }, delay);
        timeouts[name].set(stringId, timeoutId);
        timeoutsStart.set(timeoutId, Date.now() + delay)
      },
      clear,
      getTimerStart: () => {
        const timeoutId = timeouts[name].get(stringId);

        if (!timeoutId) return null;
        const endTime = timeoutsStart.get(timeoutId);

        return endTime ? Math.max(endTime, 0) : null;
      }
    });
  }
};

export default getTimeout;
