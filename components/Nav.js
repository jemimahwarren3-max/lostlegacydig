import Link from "next/link";

export default function Nav() {
  return (
    <div className="nav">
      <Link href="/" className="nav-brand">
        Lost Legacy
      </Link>
      <div className="nav-links">
        <Link href="/books">Books</Link>
        <Link href="/lessons">Lessons</Link>
        <Link href="/submit">Share your work</Link>
        <Link href="/dashboard">Creator dashboard</Link>
        <Link href="/admin">Admin</Link>
      </div>
    </div>
  );
}
