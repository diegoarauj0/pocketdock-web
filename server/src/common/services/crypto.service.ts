import { Injectable } from "@nestjs/common";
import crypto from "node:crypto";

@Injectable()
export class CryptoService {
  public hash(value: string): string {
    return crypto.createHash("sha256").update(value).digest("hex");
  }

  public createRandomCode(length: number): string {
    const bytes = Math.ceil(length / 2);

    return crypto.randomBytes(bytes).toString("hex").toUpperCase().slice(0, length);
  }

  public randomHash(): string {
    return crypto.createHash("sha256").update(crypto.randomBytes(32)).digest("hex");
  }

  public randomUUID(): string {
    return crypto.randomUUID();
  }

  public timingSafeEqual(a: string, b: string): boolean {
    const aBuffer = Buffer.from(a);
    const bBuffer = Buffer.from(b);

    if (aBuffer.length !== bBuffer.length) return false;

    return crypto.timingSafeEqual(aBuffer, bBuffer);
  }
}
