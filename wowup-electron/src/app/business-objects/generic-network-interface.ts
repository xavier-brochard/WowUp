import { GetConfig, NetworkInterface, PostConfig } from "wowup-lib-core/lib/utils";
import { CircuitBreakerWrapper } from "../services/network/network.service";
import * as memcache from "../business-objects/mem-cache";

export class GenericNetworkInterface implements NetworkInterface {
  public constructor(private _circuitBreaker: CircuitBreakerWrapper) {}

  public async getJson<T>(url: string | URL, config?: GetConfig | undefined): Promise<T> {
    return await memcache.transaction(
      url.toString(),
      () => this._circuitBreaker.getJson<T>(url, config?.headers, config?.timeoutMs),
      30
    );
  }

  public async postJson<T>(url: string | URL, config: PostConfig): Promise<T> {
    if (config.cache === true) {
      const key = `${url}-${JSON.stringify(config.body).length}`;
      return await memcache.transaction(
        key,
        () => this._circuitBreaker.postJson<T>(url, config.body, config.headers, config.timeoutMs),
        30
      );
    }
    return await this._circuitBreaker.postJson<T>(url, config.body, config.headers, config.timeoutMs);
  }
}
