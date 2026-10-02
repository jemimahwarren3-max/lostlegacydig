import { useState } from "react";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  async function handleLookup(e) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/dashboard?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }
    setSummary(data.summary);
  }

  return (
    <div className="container">
      <div className="hero" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">Creator dashboard</p>
        <h1>What sold, what's owed, when it was paid</h1>
        <p className="sub">Enter the email you used when you submitted your book or lesson.</p>
      </div>

      <form onSubmit={handleLookup} style={{ marginTop: 20 }}>
        <div>
          <label>Your email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error && <p className="notice">{error}</p>}
        <button className="btn" type="submit">
          View my sales
        </button>
      </form>

      {summary && (
        <>
          <div className="grid" style={{ marginTop: 28 }}>
            <div className="panel">
              <p className="meta">Total sales</p>
              <h2>{summary.totalSales}</h2>
            </div>
            <div className="panel">
              <p className="meta">Total paid</p>
              <h2>${summary.totalEarnedUSD.toFixed(2)}</h2>
            </div>
            <div className="panel">
              <p className="meta">Owed to you (80% share)</p>
              <h2>${summary.owedToCreatorUSD.toFixed(2)}</h2>
            </div>
          </div>

          <p className="section-title">Your items</p>
          <div className="grid">
            {[...summary.books, ...summary.lessons].map((item) => (
              <div className="card" key={`${item.type}-${item.id}`}>
                {item.status === "verified" ? (
                  <span className="badge-verified">✓ Verified</span>
                ) : item.status === "pending" ? (
                  <span className="badge-pending">⏳ Pending review</span>
                ) : (
                  <span className="badge-pending">✕ Rejected</span>
                )}
                <h3>{item.title}</h3>
                <p className="meta">{item.type === "book" ? "Book" : "Lesson"}</p>
                <span className="price-tag">${Number(item.priceUSD).toFixed(2)}</span>
              </div>
            ))}
            {summary.books.length === 0 && summary.lessons.length === 0 && <p>No submissions yet.</p>}
          </div>

          <p className="section-title">Order history</p>
          <div className="panel">
            {summary.orders.length === 0 && <p>No orders yet.</p>}
            {summary.orders.map((o) => (
              <div className="row" key={o.id}>
                <div>
                  <strong>
                    {o.itemType === "book" ? "Book" : "Lesson"} #{o.itemId}
                  </strong>
                  <p className="meta">
                    {o.buyerName} · {o.buyerPhone} · {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div>${o.amountUSD.toFixed(2)}</div>
                  <span className={`pill ${o.status === "paid" ? "pill-paid" : "pill-pending"}`}>
                    {o.status === "paid" ? `Paid ${new Date(o.paidAt).toLocaleDateString()}` : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
