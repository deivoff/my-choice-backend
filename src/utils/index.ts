export { PubSubEngine } from 'graphql-subscriptions';

declare module 'graphql-subscriptions' {
  export abstract class PubSubEngine extends PubSubEngine {
    abstract publish<T>(triggerName: string, payload: T): Promise<void>;
    abstract publish(triggerName: string, payload: any): Promise<void>;
  }
}
