export function AtelierStudy() {
  return (
    <figure className="atelier-study">
      <div className="study-topline" aria-hidden="true"><span>Muhammad Anees</span><span>Est. in curiosity</span></div>
      <div className="study-art" aria-hidden="true">
        <svg viewBox="0 0 480 450" fill="none" className="study-geometry">
          <path className="study-line" d="M51 370h378M84 96v294M388 63v327" />
          <path className="study-arch-outline" d="M137 367V199a113 113 0 0 1 226 0v168" />
          <path className="study-arch" d="M121 368V214a111 111 0 0 1 222 0v154h-63V214a48 48 0 0 0-96 0v154z" />
          <path className="study-arch-inner" d="M184 368V214a48 48 0 0 1 96 0v154" />
          <circle className="study-disc" cx="342" cy="110" r="57" />
          <path className="study-disc-line" d="M296 110h92M342 64v92" />
          <path className="study-ground" d="M84 367h304v13H84z" />
          <path className="study-line" d="m78 90 12 12m-12 0 12-12m298 294 12 12m-12 0 12-12" />
          <circle className="study-point" cx="84" cy="368" r="4" /><circle className="study-point" cx="388" cy="368" r="4" />
        </svg>
        <span className="study-side-note">Form follows thought.</span>
      </div>
      <figcaption className="study-caption"><span className="study-caption-title">Always a work in <em>progress.</em></span><span className="study-caption-note">An abstract study, until my portrait arrives.</span></figcaption>
      <div className="study-seal" aria-hidden="true"><span>MA</span><span>Made with intent</span></div>
    </figure>
  );
}
