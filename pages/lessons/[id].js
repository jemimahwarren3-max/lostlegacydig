import { useState } from "react";
import { getLessonById } from "../../lib/db";
import CheckoutForm from "../../components/CheckoutForm";

export async function getServerSideProps({ params }) {
  const lesson = getLessonById(params.id);
  if (!lesson || lesson.status !== "verified") {
    return { notFound: true };
  }
  return { props: { lesson } };
}

export default function LessonPage({ lesson }) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="container">
      <div className="hero" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">Teach &amp; Earn</p>
        <h1>{lesson.title}</h1>
        <p className="sub">taught by {lesson.teacherName}</p>
        <p className="sub">{lesson.description}</p>
        <span className="price-tag" style={{ marginTop: 12 }}>
          ${lesson.priceUSD.toFixed(2)}/month, billed by cycle, not auto-debited
        </span>
      </div>

      {!unlocked ? (
        <div className="panel">
          <h3>Unlock this month's lesson</h3>
          <p className="meta">Pay by EcoCash through Paynow for this billing cycle.</p>
          <CheckoutForm
            itemType="lesson"
            itemId={lesson.id}
            amountUSD={lesson.priceUSD}
            onPaid={() => setUnlocked(true)}
          />
        </div>
      ) : (
        <div className="reader-text">{lesson.content}</div>
      )}
    </div>
  );
}
