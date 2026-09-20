import { createFileRoute } from "@tanstack/react-router";
import { PackageEstimator } from "@/components/package-estimator";

export const Route = createFileRoute("/homeowner")({
  validateSearch: (search: Record<string, unknown>) => ({
    brand: typeof search["brand"] === "string" ? search["brand"] : undefined,
    mode: search["mode"] === "custom" ? ("custom" as const) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Package Estimator for Homeowners — ElectroSpot" },
      {
        name: "description",
        content:
          "Estimate your home wiring package by size and tier, compare retail vs factory-direct pricing, and book a free on-site inspection.",
      },
      { property: "og:title", content: "Package Estimator for Homeowners — ElectroSpot" },
      {
        property: "og:description",
        content:
          "Compare retail vs ElectroSpot pricing on a complete bill of materials for your build.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeownerPage,
});

function HomeownerPage() {
  const search = Route.useSearch();
  return <PackageEstimator search={search} />;
}
