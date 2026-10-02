import Link from "next/link";
import { getVerifiedLessons } from "../../lib/db";

export async function getServerSideProps() {
  return { props: { lessons: getVerifiedLessons() } };
}

export default function Lessons({ lessons }) {
  return (
    <div className="container">
      <div className="hero" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">Teach &amp; Earn</p>
        <h1>Learn a skill from someone who still practises it</h1>
      </div>
      <div className="grid">
        {lessons.map((l) => (
          <Link key={l.id} href={`/lessons/${l.id}`} className="card">
            <span className="badge-verified">✓ Verified</span>
            <h3>{l.title}</h3>
            <p className="meta">taught by {l.teacherName}</p>
            <p className="desc">{l.description}</p>
            <span className="price-tag">${l.priceUSD.toFixed(2)}/month, by cycle</span>
          </Link>
        ))}
        {lessons.length === 0 && <p>No verified lessons yet — check the admin queue.</p>}
      </div>
    </div>
  );
}
