import { useState } from "react";
import { getBookById } from "../../lib/db";
import CheckoutForm from "../../components/CheckoutForm";

export async function getServerSideProps({ params }) {
  const book = getBookById(params.id);
  if (!book || book.status !== "verified") {
    return { notFound: true };
  }
  return { props: { book } };
}

export default function BookPage({ book }) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="container">
      <div className="hero" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">Heritage Book</p>
        <h1>{book.title}</h1>
        <p className="sub">by {book.authorName}</p>
        <p className="sub">{book.description}</p>
        <span className="price-tag" style={{ marginTop: 12 }}>
          ${book.priceUSD.toFixed(2)}
        </span>
      </div>

      {!unlocked ? (
        <div className="panel">
          <h3>Buy this book</h3>
          <p className="meta">Pay by EcoCash through Paynow. You'll get a prompt on your phone to approve.</p>
          <CheckoutForm
            itemType="book"
            itemId={book.id}
            amountUSD={book.priceUSD}
            onPaid={() => setUnlocked(true)}
          />
        </div>
      ) : (
        <div className="reader-text">{book.content}</div>
      )}
    </div>
  );
}
