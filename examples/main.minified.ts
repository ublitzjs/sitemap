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
var router = new ExtendedRouter(
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
);
var server = extendApp(
  App(),
  openapiExtension({
    info: { title: "", version: "" },
    openapi: "3.0.0",
  }) 
);
router.bind(server).define("/", "get").define("/hello", "get");
server.route(
  {
    method: "get",
    controller() {},
    path: "/1" ,
  } 
) 
