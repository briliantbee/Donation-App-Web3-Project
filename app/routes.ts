import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_layouts.tsx", [
    index("routes/home.tsx"),
    route("admin", "routes/admin.tsx"),
    route("campaign/:id", "routes/campaign/[id]/page.tsx"), // detail campaign

  ])
] satisfies RouteConfig;
