import { useState } from "react";
import { ImageOff } from "lucide-react";

import type { Brand } from "@/lib/electrospot-data";
import { cn } from "@/lib/utils";

type CatalogImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function CatalogImage({ src, alt, className }: CatalogImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    <span
      className={cn(
        "inline-flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-white p-1.5",
        className,
      )}
    >
      {failedSrc === src ? (
        <ImageOff className="size-5 text-slate-400" role="img" aria-label={alt} />
      ) : (
        <img
          src={src}
          alt={alt}
          width={112}
          height={112}
          loading="lazy"
          decoding="async"
          className="size-full object-contain"
          onError={() => setFailedSrc(src)}
        />
      )}
    </span>
  );
}

export function BrandLogo({ brand, className }: { brand: Brand; className?: string }) {
  return (
    <CatalogImage
      src={brand.logo}
      alt={`${brand.name} logo`}
      className={cn("h-14 w-28 p-2", brand.logoOnDark && "bg-slate-800", className)}
    />
  );
}
