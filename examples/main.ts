import {
  ExtendedRouter /*_START_DEV_*/,
  type extPaths /*_END_DEV_*/,
} from "@ublitzjs/router"; /*_START_DEV_*/
import {
  genLastMod,
  routePlugin as sitemapPlugin,
  RouterPlugin as SitemapPlugin,
  type methodAddOns as sitemapAddOns,
  serverExtension as sitemapExtension,
} from "@ublitzjs/sitemap"; /*_END_DEV_*/
import {
  serverExtension as openapiExtension /*_START_DEV_*/,
  RouterPlugin as OpenapiPlugin,
  routePlugin as openapiPlugin,
  type methodAddOns as openapiAddons /*_END_DEV_*/,
} from "@ublitz.js/openapi";
import { App } from "uWebSockets.js";
import {
  DeclarativeResponse,
  extendApp /*_START_DEV_*/,
  type onlyHttpMethods /*_END_DEV_*/,
} from "@ublitzjs/core";
var router = new ExtendedRouter(
  {
    "/": {
      get: {
        controller: new DeclarativeResponse().end("hi") /*_START_DEV_*/,
        //will create only "loc"
        sitemap: {},
        openapi: {
          summary: "main route",
        } /*_END_DEV_*/,
      },
    },
    "/hello": {
      get: {
        controller: new DeclarativeResponse().end("hello") /*_START_DEV_*/,
        sitemap: {
          priority: 1,
          changefreq: "never",
          lastmod: genLastMod(new Date("2025")),
        } /*_END_DEV_*/,
      },
    },
  } /*_START_DEV_*/ satisfies extPaths<sitemapAddOns & openapiAddons, {}>,
  [SitemapPlugin, OpenapiPlugin] /*_END_DEV_*/
);
var server = extendApp(
  App(),
  openapiExtension({
    info: { title: "", version: "" },
    openapi: "3.0.0",
  }) /*_START_DEV_*/,
  sitemapExtension("http://localhost:9001") /*_END_DEV_*/
);
router.bind(server).define("/", "get").define("/hello", "get");
server.route/*_START_DEV_*/ <
  onlyHttpMethods,
  sitemapAddOns & openapiAddons
> /*_END_DEV_*/(
  {
    method: "get",
    controller() {},
    path: "/1" /*_START_DEV_*/,
    sitemap: {
      changefreq: "daily",
    },
    openapi: {
      description: "new route",
      deprecated: false,
      tags: ["new"],
    } /*_END_DEV_*/,
  } /*_START_DEV_*/,
  [sitemapPlugin, openapiPlugin] /*_END_DEV_*/
) /*_START_DEV_*/;
if (process.argv.includes("--build")) {
  await Promise.all([
    server.buildOpenApi("openapi.json", false),
    server.sitemap.build("sitemap.xml", true),
  ]);
  process.exit(0);
} /*_END_DEV_*/
