export abstract class BaseOrderOperation {
  constructor() {}

  protected abstract handle(): Promise<boolean>;
}
