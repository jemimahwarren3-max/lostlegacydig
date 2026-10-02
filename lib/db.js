// Lost Legacy MVP data layer.
//
// This is a flat JSON-file store, not a real database. It is intentionally this
// simple so the MVP can run with zero external accounts before launch day.
// Swap this file out for Postgres/Supabase once the pilot needs concurrent
// writers or more than a handful of users — the function signatures below are
// written so the rest of the app doesn't need to change when that happens.

import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function nextId(items) {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

// ---------- Books ----------

export function getAllBooks() {
  return readDB().books;
}

export function getVerifiedBooks() {
  return readDB().books.filter((b) => b.status === "verified");
}

export function getBookById(id) {
  return readDB().books.find((b) => b.id === Number(id));
}

export function addBook({ title, authorName, authorEmail, priceUSD, description, content }) {
  const db = readDB();
  const book = {
    id: nextId(db.books),
    type: "book",
    title,
    authorName,
    authorEmail,
    priceUSD: Number(priceUSD),
    description,
    content,
    status: "pending", // pending | verified | rejected
    createdAt: new Date().toISOString(),
  };
  db.books.push(book);
  writeDB(db);
  return book;
}

// ---------- Lessons ----------

export function getAllLessons() {
  return readDB().lessons;
}

export function getVerifiedLessons() {
  return readDB().lessons.filter((l) => l.status === "verified");
}

export function getLessonById(id) {
  return readDB().lessons.find((l) => l.id === Number(id));
}

export function addLesson({ title, teacherName, teacherEmail, priceUSD, description, content }) {
  const db = readDB();
  const lesson = {
    id: nextId(db.lessons),
    type: "lesson",
    title,
    teacherName,
    teacherEmail,
    priceUSD: Number(priceUSD), // billed per cycle, not auto-debited
    description,
    content,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.lessons.push(lesson);
  writeDB(db);
  return lesson;
}

// ---------- Verification queue (shared by books + lessons) ----------

export function getPendingItems() {
  const db = readDB();
  return [...db.books.filter((b) => b.status === "pending"), ...db.lessons.filter((l) => l.status === "pending")].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
}

export function setItemStatus(type, id, status) {
  const db = readDB();
  const list = type === "book" ? db.books : db.lessons;
  const item = list.find((i) => i.id === Number(id));
  if (!item) return null;
  item.status = status;
  item.reviewedAt = new Date().toISOString();
  writeDB(db);
  return item;
}

// ---------- Orders / sales ----------

export function createOrder({ itemType, itemId, buyerName, buyerPhone, amountUSD }) {
  const db = readDB();
  const order = {
    id: nextId(db.orders),
    itemType,
    itemId: Number(itemId),
    buyerName,
    buyerPhone,
    amountUSD: Number(amountUSD),
    status: "pending", // pending | paid | failed
    paynowReference: null,
    pollUrl: null,
    createdAt: new Date().toISOString(),
    paidAt: null,
  };
  db.orders.push(order);
  writeDB(db);
  return order;
}

export function attachPaynowReference(orderId, reference, pollUrl) {
  const db = readDB();
  const order = db.orders.find((o) => o.id === Number(orderId));
  if (!order) return null;
  order.paynowReference = reference;
  order.pollUrl = pollUrl;
  writeDB(db);
  return order;
}

export function markOrderPaid(orderId) {
  const db = readDB();
  const order = db.orders.find((o) => o.id === Number(orderId));
  if (!order) return null;
  order.status = "paid";
  order.paidAt = new Date().toISOString();
  writeDB(db);
  return order;
}

export function getOrderById(id) {
  return readDB().orders.find((o) => o.id === Number(id));
}

export function getAllOrders() {
  return readDB().orders;
}

// Creator dashboard: what sold, what's owed, when paid.
// "Owed" = paid orders not yet marked as paid-out to the creator (payout tracking
// is intentionally manual at this stage — see the work plan's build budget).
export function getCreatorSummary(email) {
  const db = readDB();
  const myBooks = db.books.filter((b) => b.authorEmail === email);
  const myLessons = db.lessons.filter((l) => l.teacherEmail === email);
  const myItemKeys = new Set([
    ...myBooks.map((b) => `book-${b.id}`),
    ...myLessons.map((l) => `lesson-${l.id}`),
  ]);
  const myOrders = db.orders.filter((o) => myItemKeys.has(`${o.itemType}-${o.itemId}`));
  const paidOrders = myOrders.filter((o) => o.status === "paid");
  const totalEarnedUSD = paidOrders.reduce((sum, o) => sum + o.amountUSD, 0);
  const payoutRate = 0.8; // creator share; platform fee covers Paynow fees + verification cost
  return {
    books: myBooks,
    lessons: myLessons,
    orders: myOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    totalSales: myOrders.length,
    totalPaidOrders: paidOrders.length,
    totalEarnedUSD,
    owedToCreatorUSD: Math.round(totalEarnedUSD * payoutRate * 100) / 100,
  };
}
