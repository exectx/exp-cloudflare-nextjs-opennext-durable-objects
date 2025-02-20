import { DurableObject } from "cloudflare:workers";

// Durable Object
export class Counter extends DurableObject<CloudflareEnv> {
  async getCounterValue() {
    const value = (await this.ctx.storage.get<number>("value")) || 0;
    return value;
  }

  async increment(amount = 1) {
    let value = (await this.ctx.storage.get<number>("value")) || 0;
    value += amount;
    // You do not have to worry about a concurrent request having modified the value in storage.
    // "input gates" will automatically protect against unwanted concurrency.
    // Read-modify-write is safe.
    await this.ctx.storage.put("value", value);
    return value;
  }

  async decrement(amount = 1) {
    let value = (await this.ctx.storage.get<number>("value")) || 0;
    value -= amount;
    await this.ctx.storage.put("value", value);
    return value;
  }
}
