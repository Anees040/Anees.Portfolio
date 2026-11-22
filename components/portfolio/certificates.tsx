import Image from "next/image";
import { ArrowUpRight, FileText } from "lucide-react";
import { credentials } from "@/lib/profile-content";
import styles from "./professional-profile.module.css";

function CredentialDate({ value }: { value: string }) {
  return <time dateTime={value}>{new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(value))}</time>;
}

export function Certificates() {
  const approved = credentials.filter(credential => credential.approved);
  return <section id="certificates" tabIndex={-1} className={styles.certificates} aria-labelledby="certificates-heading">
    <h3 id="certificates-heading">Certificates &amp; Credentials</h3>
    {approved.length === 0 ? <p className={styles.credentialsEmpty}>Verified certificates and credentials will appear here as I add them.</p> : <ul className={styles.credentials}>{approved.map(credential => <li key={credential.id}>
      {credential.asset.kind === "image" ? <a className={styles.credentialImage} href={credential.asset.src} aria-label={`View ${credential.title} certificate`}><Image src={credential.asset.src} width={credential.asset.width} height={credential.asset.height} alt={credential.asset.alt} sizes="(max-width: 767px) 90vw, 600px" /></a> : <a className={styles.credentialDocument} href={credential.asset.href} download><FileText size={22} aria-hidden="true" />{credential.asset.label}</a>}
      <h4>{credential.title}</h4><p>{credential.issuer}</p>
      <dl className={styles.credentialDetails}><div><dt>Issued</dt><dd><CredentialDate value={credential.issueDate} /></dd></div>{credential.expirationDate && <div><dt>Expires</dt><dd><CredentialDate value={credential.expirationDate} /></dd></div>}{credential.credentialId && <div><dt>Credential ID</dt><dd>{credential.credentialId}</dd></div>}</dl>
      {credential.description && <p>{credential.description}</p>}
      <a className="text-link" href={credential.verificationUrl}><span>Verify {credential.title}</span><ArrowUpRight size={17} aria-hidden="true" /></a>
    </li>)}</ul>}
  </section>;
}
