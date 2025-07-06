import type { HttpMethods, routeFNOpts, Server } from "@ublitzjs/core";
import type { ExtendedRouter } from "@ublitzjs/router";
type Url = {
  /**
   * @see https://www.sitemaps.org/protocol.html#lastmoddef
   * @example "2005-01-01"
   * @format YYYY-MM-DD
   */
  lastmod: `${number}-${number}-${number}`;
  /**
   * @see https://www.sitemaps.org/protocol.html#changefreqdef
   */
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  /**
   * @see https://www.sitemaps.org/protocol.html#prioritydef
   */
  priority: number;
};
export type methodAddOns = {
  /**
   * If you include an empty object, the route will still appear inside sitemap.xml
   */
  sitemap?: Partial<Url>;
};
/**
 * generates lastmod value
 */
export function genLastMod(date: Date): `${number}-${number}-${number}`;
/**
 * goes to server.route method from "core" package
 */
export function routePlugin<method extends HttpMethods>(
  route: routeFNOpts<method> & methodAddOns,
  server: Server & ReturnType<typeof serverExtension>
): void;
/**
 * Goes straight to ExtendedRouter from @ublitzjs/router
 */
export function RouterPlugin(
  this: ExtendedRouter<any>,
  methods: string[]
): void;
/**
 * pass this function in "extendApp" fron "core" package.
 * @param host something like "https://example.com"
 */
export function serverExtension(host: string): {
  sitemap: {
    build(path: string, exitFromNodejs?: boolean): Promise<any>;
    data: route[];
  };
};
type route = { loc: string } & Partial<Url>;
