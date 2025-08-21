import fs from "node:fs";
import { stat } from "node:fs/promises";
import process from "node:process";
var host;
function RouterPlugin(methods) {
  if (!methods.includes("get") || !this.paths[this._currentPath].get.sitemap)
    return;
  var server = this.server;
  server.sitemap.data.push({
    ...this.paths[this._currentPath].get.sitemap,
    loc: host + this.prefixedPath,
  });
  delete this.paths[this._currentPath].get.sitemap;
}
function routePlugin(route, server) {
  if (!route.sitemap) throw new Error("no sitemap detected");
  if (route.method !== "get")
    throw new Error("Can't register different methods from 'GET'");
  server.sitemap.data.push({ ...route.sitemap, loc: host + route.path });
}
var serverExtension = (h) => {
    host = h;
    return {
      sitemap: {
        build(path, exit) {
          const stream = fs.createWriteStream(path);
          stream.write(
            '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
          );
          if (this.data.length > 50000) throw new Error("TOO LARGE SITEMAP");
          for (const item of this.data) {
            let str = `  <url>\n`;
            let key;
            for (key in item) str += `    <${key}>${item[key]}</${key}>\n`;
            str += "  </url>\n";
            stream.write(str);
          }
          stream.write("</urlset>\n");
          return new Promise((resolve) =>
            stream.end(async () => {
              if (exit) process.exit(0);
              delete this.data;
              if ((await stat(path)).size > 1024 ** 2 * 50)
                throw new Error("SITEMAP MUST NOT EXCEEED 50 MEGABYTES");
              resolve();
            })
          );
        },
        data: [],
        add(opts){
          opts.loc = host + opts.loc;
          this.data.push(opts);
        }
      },
    };
  },
  genLastMod = (date) =>
    `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
export { serverExtension, genLastMod, routePlugin, RouterPlugin };
