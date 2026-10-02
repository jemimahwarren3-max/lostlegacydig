import "../styles/globals.css";
import Nav from "../components/Nav";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Nav />
      <Component {...pageProps} />
      <footer className="footer">
        Lost Legacy Digital · Heritage Books. Teach &amp; Earn. Preserve &amp; Shop.
      </footer>
    </>
  );
}
