import { DiscoveryService } from "@nestjs/core";

export const EventHandler = DiscoveryService.createDecorator<void>();
