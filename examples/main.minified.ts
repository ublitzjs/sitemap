// This file is like an entry point of your backend server.
// It uses @ublitzjs/sitemap, @ublitzjs/core, @ublitzjs/openapi, @ublitzjs/router, @ublitzjs/static
// Sitemap package is competely cut in minified version because it doesn't provide any serving function, like openapi does

import {
  ExtendedRouter ,
} from "@ublitzjs/router"; 
import {
  serverExtension as openapiExtension ,
} from "@ublitz.js/openapi";
import { App } from "uWebSockets.js";
import {
  DeclarativeResponse,
  extendApp ,
} from "@ublitzjs/core";
import { basicSendFile } from "@ublitzjs/static";
import { stat } from "node:fs/promises";

var server = extendApp(
  App(),
  openapiExtension({
    info: { title: "", version: "" },
    openapi: "3.0.0",
  }) 
).route(
  {
    method: "get",
    controller() {},
    path: "/1" ,
  } 
);
new ExtendedRouter(
  {
    "/": {
      get: {
        controller: new DeclarativeResponse().end("hi") ,
      },
    },
    "/hello": {
      get: {
        controller: new DeclarativeResponse().end("hello") ,
      },
    },
  } 
)
  .bind(server)
  .define("/", "get")
  .define("/hello", "get"); 

await server.serveOpenApi("/docs", {
  build: false,
  clearMimes: true,
  path: "openapi.json",
});
server.get(
  "/sitemap.xml",
  basicSendFile({
    path: "sitemap.xml",
    maxSize: (await stat("sitemap.xml")).size,
    contentType: "application/xml",
  })
);

server.listen(9001, (token) => {
  console.log("LISTENING?", !!token);
});
