import express from "express";
import helmet from "helmet";
import { yoga } from "./graphql/yoga.js";

export const app = express();

// `crossOriginResourcePolicy` defaults to "same-origin", which the browser
// enforces independently of CORS — it would block the frontend (a different
// origin) from reading responses even though CORS headers allow it.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(yoga.graphqlEndpoint, yoga);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});
