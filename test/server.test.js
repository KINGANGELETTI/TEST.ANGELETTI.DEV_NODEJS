const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const { createApp } = require("../server");

describe("server", () => {
  let server;
  let baseUrl;

  before((_, done) => {
    server = createApp();
    server.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  it("serves index.html at /", (_, done) => {
    http.get(baseUrl + "/", (res) => {
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers["content-type"], "text/html");
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        assert.ok(body.includes("Coming Soon"));
        done();
      });
    });
  });

  it("returns 404 for unknown paths", (_, done) => {
    http.get(baseUrl + "/nonexistent.html", (res) => {
      assert.strictEqual(res.statusCode, 404);
      done();
    });
  });
});
