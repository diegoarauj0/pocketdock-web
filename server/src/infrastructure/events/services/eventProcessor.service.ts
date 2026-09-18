import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { EVENT_CONSTANT } from "../event.constant";
import { EventHandler } from "../event.decorator";
import { EventBase } from "./eventBase.service";
import { DiscoveryService } from "@nestjs/core";

@Injectable()
export class EventProcessor implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(EventProcessor.name);

  private timer?: NodeJS.Timeout;

  constructor(private readonly discovery: DiscoveryService) {}

  public async onApplicationBootstrap(): Promise<void> {
    const handlers = this.discoverHandlers();

    if (handlers.length === 0) {
      this.logger.warn("No event handlers found.");
      return;
    }

    for (const handler of handlers) {
      await handler.reconcile();
    }

    await this.poll(handlers);

    this.timer = setInterval(() => void this.poll(handlers), EVENT_CONSTANT.POLLING_INTERVAL_MS);
  }

  public onApplicationShutdown(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private async poll(handlers: EventBase[]): Promise<void> {
    try {
      await Promise.all(handlers.map((handler) => handler.process()));
    } catch (error) {
      this.logger.error("Failed to poll events.", error);
    }
  }

  private discoverHandlers(): EventBase[] {
    return this.discovery.getProviders({ metadataKey: EventHandler.KEY }).map(({ instance }) => instance as EventBase);
  }
}
