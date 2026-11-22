import Image from "next/image";
import { Expand, X } from "lucide-react";
import type { StoryImage } from "@/lib/case-studies";
import { ScrollLayers } from "./scroll-layers";

export function ProjectGallery({ images, slug }: { images: StoryImage[]; slug: string }) {
  return <ScrollLayers className="case-gallery-motion"><div className="project-gallery">{images.map((image, index) => {
    const id = `gallery-${slug}-${index}`;
    return <figure key={image.src}>
      <button className="gallery-image-trigger" type="button" popoverTarget={id} aria-label={`Enlarge screenshot: ${image.caption}`}>
        <span className="gallery-screen-plane" data-case-layer><Image src={image.src} width={image.width} height={image.height} alt={image.alt} sizes="(max-width: 767px) 78vw, (max-width: 1279px) 30vw, 350px" /></span>
        <span><Expand size={16} aria-hidden="true" /> Inspect screen</span>
      </button>
      <figcaption>{image.caption}</figcaption>
      <div id={id} popover="auto" className="gallery-popover" role="dialog" aria-label={image.caption}>
        <button type="button" className="popover-close" popoverTarget={id} popoverTargetAction="hide" aria-label="Close screenshot" autoFocus><X size={20} aria-hidden="true" /></button>
        <p>{image.caption}</p><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 767px) 90vw, 600px" />
      </div>
    </figure>;
  })}</div></ScrollLayers>;
}
