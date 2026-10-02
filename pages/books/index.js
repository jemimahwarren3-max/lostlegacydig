import Link from "next/link";
import { getVerifiedBooks } from "../../lib/db";

export async function getServerSideProps() {
  return { props: { books: getVerifiedBooks() } };
}

export default function Books({ books }) {
  return (
    <div className="container">
      <div className="hero" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">Heritage Books</p>
        <h1>Stories and knowledge worth paying for, at home-market prices</h1>
      </div>
      <div className="grid">
        {books.map((b) => (
          <Link key={b.id} href={`/books/${b.id}`} className="card">
            <span className="badge-verified">✓ Verified</span>
            <h3>{b.title}</h3>
            <p className="meta">by {b.authorName}</p>
            <p className="desc">{b.description}</p>
            <span className="price-tag">${b.priceUSD.toFixed(2)}</span>
          </Link>
        ))}
        {books.length === 0 && <p>No verified books yet — check the admin queue.</p>}
      </div>
    </div>
  );
}
