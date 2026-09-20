import { createFileRoute } from "@tanstack/react-router";
import { PackageEstimator } from "@/components/package-estimator";

export const Route = createFileRoute("/electrician")({
  head: () => ({ meta: [{ title: "Electrician / Contractor — ElectroSpot" }] }),
  component: () => <PackageEstimator professional />,
});
