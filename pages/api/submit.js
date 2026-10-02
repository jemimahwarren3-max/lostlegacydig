import { addBook, addLesson } from "../../lib/db";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { kind, title, creatorName, creatorEmail, priceUSD, description, content } = req.body;

  if (!title || !creatorName || !creatorEmail || !priceUSD || !description || !content) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let item;
  if (kind === "book") {
    item = addBook({ title, authorName: creatorName, authorEmail: creatorEmail, priceUSD, description, content });
  } else if (kind === "lesson") {
    item = addLesson({ title, teacherName: creatorName, teacherEmail: creatorEmail, priceUSD, description, content });
  } else {
    return res.status(400).json({ error: "kind must be 'book' or 'lesson'" });
  }

  return res.status(200).json({ item });
}
