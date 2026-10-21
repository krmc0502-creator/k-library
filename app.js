// K.Library の動き

// ---------- あいさつと季節のひとこと ----------

// 時間帯に合わせたあいさつ
function greetingFor(hour) {
  if (hour >= 5 && hour < 10) return "おはようございます";
  if (hour >= 10 && hour < 17) return "こんにちは";
  return "こんばんは";
}

// 季節に合わせたひとこと（月ごと）
const seasonWords = {
  1: "冬の朝ですね。あたたかい部屋で、ゆっくり本をめくりませんか？",
  2: "まだ寒い日が続きますね。お気に入りの一冊と過ごしましょう。",
  3: "春が近づいてきました。新しい本との出会いがありますように。",
  4: "春ですね。今日はどんな本と出会えるかな？",
  5: "緑がきれいな季節です。木かげで本を開いてみませんか？",
  6: "雨の音をききながら、本の森をさんぽしませんか？",
  7: "夏の始まりですね。冒険の本はいかがですか？",
  8: "夏休みの読書、どんな本に出会えるかな？",
  9: "風が少し涼しくなってきました。読書の季節が近づいています。",
  10: "秋の夜長に、どんな本と出会えるかな？",
  11: "読書の秋ですね。今日はどんな本と出会えるかな？",
  12: "冬の始まりです。心があたたまる本を探しませんか？",
};

const now = new Date();
document.getElementById("hello").textContent = greetingFor(now.getHours());
document.getElementById("season").textContent = seasonWords[now.getMonth() + 1];

// ---------- 今日の出会い（いまは見本の4冊） ----------
// あとの段階で、本のたねや季節に合わせて毎朝選ぶしくみに入れかえます

const sampleBooks = [
  { reason: "本のたねから", reasonColor: "#3B5232", reasonBg: "#E3EBD9",
    title: "モモ", author: "ミヒャエル・エンデ",
    cover: "#3E5A7A", coverText: "#F7F2E4", mark: "sprout" },
  { reason: "秋の本", reasonColor: "#7A4A16", reasonBg: "#F5E4CC",
    title: "14ひきのあきまつり", author: "いわむらかずお",
    cover: "#C9783E", coverText: "#FFF8EC", coverTitle: "14ひきの\nあきまつり" },
  { reason: "いま人気の本", reasonColor: "#6A3E5A", reasonBg: "#F1E1EA",
    title: "おばけずかん", author: "斉藤洋",
    cover: "#2F3B4C", coverText: "#F2EEE2" },
  { reason: "好きな作家から", reasonColor: "#4A4A6E", reasonBg: "#E4E4F0",
    title: "ねずみくんのチョッキ", author: "なかえよしを",
    cover: "#EFE6D2", coverText: "#A0362B", coverTitle: "ねずみくんの\nチョッキ", mark: "star" },
];

function showBooks(books) {
  const area = document.getElementById("books");
  area.innerHTML = "";
  for (const book of books) {
    const card = document.createElement("article");
    card.className = "book";

    const reason = document.createElement("span");
    reason.className = "reason";
    reason.textContent = book.reason;
    reason.style.color = book.reasonColor;
    reason.style.background = book.reasonBg;

    const cover = document.createElement("div");
    cover.className = "cover";
    cover.textContent = book.coverTitle || book.title;
    cover.style.background = book.cover;
    cover.style.color = book.coverText;
    if (book.mark) {
      const mark = document.createElement("img");
      mark.className = "mark";
      mark.src = book.mark === "star" ? "images/star.png" : "images/sprout.png";
      mark.alt = book.mark === "star" ? "お気に入り" : "本のたね";
      cover.appendChild(mark);
    }

    const info = document.createElement("div");
    const title = document.createElement("p");
    title.className = "title";
    title.textContent = book.title;
    const author = document.createElement("p");
    author.className = "author";
    author.textContent = book.author;
    info.append(title, author);

    card.append(reason, cover, info);
    area.appendChild(card);
  }
}

showBooks(sampleBooks);

// ---------- ちいさなお知らせ ----------

let toastTimer;
// message: 表示する文, action: { label, run } を渡すとボタンもつく（「もとに戻す」など）
function showToast(message, action) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  if (action) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", () => {
      action.run();
      toast.classList.remove("show");
    });
    toast.appendChild(button);
  }
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), action ? 5000 : 2600);
}

// ---------- iPhoneに覚えておくしくみ ----------

function loadSetting(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (e) {
    return fallback;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // 保存できなくても、画面はそのまま使えるようにする
  }
}

// ---------- 本の記録 ----------
// 1冊ごとに、次のような形でiPhoneの中に保存します
// {
//   id:        本ごとの番号
//   title:     タイトル
//   author:    著者（本の情報から入れる）
//   isbn:      本の番号（ISBN）
//   cover:     表紙の絵のアドレス
//   status:    "seed"（本のたね） / "reserved"（予約中） / "borrowed"（貸出中）
//              / "met"（出会った本） / "home"（家に迎えた本）
//   member:    だれの本か "all"（家族） / "mama" / "aoi" / "yuto"
//   favorite:  お気に入りの星
//   addedAt:   迎えた日時
// }

const BOOKS_KEY = "k-library-books";

function loadBooks() {
  try {
    return JSON.parse(localStorage.getItem(BOOKS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveBooks() {
  try {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    return true;
  } catch (e) {
    showToast("保存できませんでした。もう一度ためしてください");
    return false;
  }
}

let books = loadBooks();

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ---------- 家族 ----------

const people = {
  all: { name: "家族", icon: null },
  mama: { name: "ママ", icon: "images/tanuki.png" },
  aoi: { name: "あおい", icon: "images/usagi.png" },
  yuto: { name: "ゆうと", icon: "images/risu.png" },
};

// ---------- 本の状態 ----------
// hash: 画面のアドレスの「#」のあと

const statuses = {
  seed: { name: "本のたね", hash: "tane", icon: "images/sprout.png",
    lead: "いつか読んでみたい本たち。未来の出会いの芽を、ここで育てています。",
    empty: "まだ本のたねはありません。<br>「今日」の画面から、気になった本を迎えてみましょう。" },
  reserved: { name: "予約中", hash: "yoyaku", icon: "images/sprout.png",
    lead: "図書館で予約している本。届く日を楽しみに待ちましょう。",
    empty: "予約中の本はありません。<br>本のたねを開いて「予約中」にすると、ここに並びます。" },
  borrowed: { name: "貸出中", hash: "kashidashi", icon: "images/tree.png",
    lead: "いま図書館から借りている本。読めるところまで、気楽にどうぞ。",
    empty: "借りている本はありません。" },
  met: { name: "出会った本", hash: "deai", icon: "images/star.png",
    lead: "ページを開いて出会えた本たち。最後まで読んでいなくても、立派な出会いです。",
    empty: "出会った本はまだありません。<br>少しでも開いた本は、ここに残しておきましょう。" },
  home: { name: "家に迎えた本", hash: "ie", icon: "images/tree.png",
    lead: "買ったり、もらったりして、家にいる本たち。",
    empty: "家に迎えた本はまだありません。" },
};

function statusFromHash() {
  const hash = location.hash.slice(1);
  return Object.keys(statuses).find((key) => statuses[key].hash === hash) || null;
}

let currentMember = loadSetting("k-library-member", "all");
if (!people[currentMember]) currentMember = "all";

const memberButtons = document.querySelectorAll(".member");

function selectMember(id) {
  currentMember = id;
  memberButtons.forEach((button) => {
    const isSelected = button.dataset.member === id;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  saveSetting("k-library-member", id);
  render();
}

memberButtons.forEach((button) => {
  button.addEventListener("click", () => selectMember(button.dataset.member));
});

// 選んでいる人の本だけを取り出す（「家族」のときは全員の本）
function visibleBooks() {
  if (currentMember === "all") return books;
  return books.filter((book) => book.member === currentMember);
}

// ---------- 本のたねを迎える ----------

// 本を1冊、本のたねとして迎える（info: さがして見つかった本の情報。なければタイトルだけ）
function addSeed(title, info) {
  const book = {
    id: newId(),
    title: (info && info.title) || title,
    author: (info && info.author) || "",
    isbn: (info && info.isbn) || "",
    cover: (info && info.cover) || "",
    status: "seed",
    member: currentMember,
    favorite: false,
    addedAt: new Date().toISOString(),
  };
  books.unshift(book);
  if (!saveBooks()) {
    books.shift();
    return;
  }
  const input = document.getElementById("seed-input");
  input.value = "";
  input.blur();
  hideSeedResults();
  render();
  showToast(`『${book.title}』を本のたねとして迎えました`);
}

function hideSeedResults() {
  const area = document.getElementById("seed-results");
  area.hidden = true;
  area.innerHTML = "";
}

document.getElementById("seed-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = document.getElementById("seed-input");
  const title = input.value.trim();
  if (!title) {
    showToast("気になった本のタイトルを入れてください");
    input.focus();
    return;
  }
  input.blur();
  const area = document.getElementById("seed-results");
  area.hidden = false;
  area.innerHTML = '<p class="results-note">本をさがしています…</p>';

  const found = await searchBooks(title);
  if (input.value.trim() !== title) return; // さがしている間にタイトルが変わったとき
  if (!found || !found.length) {
    addSeed(title);
    if (!found) showToast(`『${title}』を迎えました（本の情報は、あとで調べられます）`);
    return;
  }
  showResults(area, found, (info) => addSeed(title, info), `「${title}」だけで迎える`, () => addSeed(title));
});

// ---------- 本を外す（すぐに「もとに戻す」もできる） ----------

function removeBook(id) {
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return;
  const [removed] = books.splice(index, 1);
  saveBooks();
  render();
  showToast(`『${removed.title}』を外しました`, {
    label: "もとに戻す",
    run: () => {
      books.splice(index, 0, removed);
      saveBooks();
      render();
    },
  });
}

// ---------- 本のくわしい画面（状態・だれの本・星を変える） ----------

let openBookId = null;

function findBook(id) {
  return books.find((book) => book.id === id);
}

// 1冊の中身を変えて保存する。うまくいかなければ元に戻す
function changeBook(id, changes) {
  const book = findBook(id);
  if (!book) return null;
  const before = { ...book };
  Object.assign(book, changes);
  if (!saveBooks()) {
    Object.assign(book, before);
    return null;
  }
  render();
  renderSheet();
  return before;
}

function choiceButton(label, selected, onClick, icon) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice";
  button.classList.toggle("selected", selected);
  button.setAttribute("aria-pressed", String(selected));
  if (icon) {
    const img = document.createElement("img");
    img.src = icon;
    img.alt = "";
    button.appendChild(img);
  }
  button.append(label);
  button.addEventListener("click", onClick);
  return button;
}

function renderSheet() {
  const book = findBook(openBookId);
  if (!book) return;
  const sheetCover = document.getElementById("sheet-cover");
  if (sheetCover.dataset.for !== book.id + book.cover + book.isbn) {
    sheetCover.innerHTML = "";
    sheetCover.classList.remove("has-cover");
    putCover(sheetCover, book);
    sheetCover.dataset.for = book.id + book.cover + book.isbn;
  }
  document.getElementById("sheet-title").textContent = book.title;
  document.getElementById("sheet-author").textContent = book.author || "";
  document.getElementById("sheet-date").textContent = `${formatDate(book.addedAt)}に迎えた本`;
  document.getElementById("sheet-find").textContent =
    book.isbn || book.cover ? "本の情報を調べなおす" : "本の情報と表紙をさがす";

  const star = document.getElementById("sheet-star");
  star.classList.toggle("on", !!book.favorite);
  star.setAttribute("aria-pressed", String(!!book.favorite));

  const statusArea = document.getElementById("sheet-status");
  statusArea.innerHTML = "";
  for (const [key, info] of Object.entries(statuses)) {
    statusArea.appendChild(choiceButton(info.name, book.status === key, () => {
      if (book.status === key) return;
      const before = changeBook(book.id, { status: key });
      if (!before) return;
      showToast(`「${info.name}」にしました`, {
        label: "もとに戻す",
        run: () => changeBook(book.id, { status: before.status }),
      });
    }));
  }

  const memberArea = document.getElementById("sheet-member");
  memberArea.innerHTML = "";
  for (const [key, who] of Object.entries(people)) {
    memberArea.appendChild(choiceButton(who.name, book.member === key, () => {
      if (book.member !== key) changeBook(book.id, { member: key });
    }, who.icon));
  }
}

function openSheet(id) {
  openBookId = id;
  hideSheetResults();
  renderSheet();
  document.getElementById("sheet-back").hidden = false;
  document.getElementById("sheet").hidden = false;
  document.body.classList.add("sheet-open");
}

function closeSheet() {
  openBookId = null;
  document.getElementById("sheet-back").hidden = true;
  document.getElementById("sheet").hidden = true;
  document.body.classList.remove("sheet-open");
}

document.getElementById("sheet-close").addEventListener("click", closeSheet);
document.getElementById("sheet-back").addEventListener("click", closeSheet);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && openBookId) closeSheet();
});

document.getElementById("sheet-star").addEventListener("click", () => {
  const book = findBook(openBookId);
  if (!book) return;
  const on = !book.favorite;
  if (changeBook(book.id, { favorite: on })) {
    showToast(on ? "お気に入りの星をつけました" : "星をはずしました");
  }
});

function hideSheetResults() {
  const area = document.getElementById("sheet-results");
  area.hidden = true;
  area.innerHTML = "";
}

document.getElementById("sheet-find").addEventListener("click", async () => {
  const book = findBook(openBookId);
  if (!book) return;
  const area = document.getElementById("sheet-results");
  area.hidden = false;
  area.innerHTML = '<p class="results-note">本をさがしています…</p>';
  const found = await searchBooks(book.title);
  if (openBookId !== book.id) return;
  if (!found) {
    area.innerHTML = '<p class="results-note">いまは本の情報を調べられませんでした。タイトルだけでも、このまま使えます。</p>';
    return;
  }
  if (!found.length) {
    area.innerHTML = '<p class="results-note">見つかりませんでした。タイトルを少し短くすると見つかることがあります。</p>';
    return;
  }
  showResults(area, found, (info) => {
    const before = changeBook(book.id, { title: info.title, author: info.author, isbn: info.isbn, cover: info.cover });
    hideSheetResults();
    if (before) {
      showToast("本の情報を入れました", {
        label: "もとに戻す",
        run: () => changeBook(book.id, { title: before.title, author: before.author, isbn: before.isbn || "", cover: before.cover || "" }),
      });
    }
  }, "やめる", hideSheetResults);
});

document.getElementById("sheet-remove").addEventListener("click", () => {
  const id = openBookId;
  closeSheet();
  removeBook(id);
});

// ---------- 本の情報と表紙をさがす ----------
// 本の情報：Google Books（無料・登録なし）／表紙が無いときは国立国会図書館サーチの書影

// Google Books の「鍵」（無料）。鍵がないと、いまはGoogleに断られてしまう
// 鍵は github.io からしか使えないように制限してあるので、ここに書いても安全です
const GOOGLE_BOOKS_KEY = "AIzaSyCq_SoQy4M8dC2DZQ1IBKTCXnwfYyp2Q0I";

async function searchBooks(query) {
  const url = "https://www.googleapis.com/books/v1/volumes?printType=books&maxResults=6&country=JP&q=" +
    encodeURIComponent(query) + (GOOGLE_BOOKS_KEY ? `&key=${GOOGLE_BOOKS_KEY}` : "");
  const stop = new AbortController();
  const timer = setTimeout(() => stop.abort(), 8000);
  try {
    const response = await fetch(url, { signal: stop.signal });
    if (!response.ok) return null;
    const data = await response.json();
    return (data.items || []).map((item) => {
      const v = item.volumeInfo || {};
      const ids = v.industryIdentifiers || [];
      const isbn = (ids.find((i) => i.type === "ISBN_13") || ids.find((i) => i.type === "ISBN_10") || {}).identifier || "";
      const thumb = (v.imageLinks && (v.imageLinks.thumbnail || v.imageLinks.smallThumbnail)) || "";
      return {
        title: v.subtitle ? `${v.title} ${v.subtitle}` : v.title || "",
        author: (v.authors || []).join("、"),
        publisher: v.publisher || "",
        year: (v.publishedDate || "").slice(0, 4),
        isbn: isbn,
        cover: thumb.replace(/^http:/, "https:").replace("&edge=curl", ""),
      };
    }).filter((b) => b.title);
  } catch (e) {
    return null; // 電波がない・混んでいるときは、調べずに進む
  } finally {
    clearTimeout(timer);
  }
}

// 表紙の絵の候補（Google Books → 国立国会図書館サーチ）
function coverSources(book) {
  const list = [];
  if (book.cover) list.push(book.cover);
  if (book.isbn && book.isbn.length === 13) list.push(`https://ndlsearch.ndl.go.jp/thumbnail/${book.isbn}.jpg`);
  return list;
}

// 色の板の上に、表紙の絵が見つかれば重ねる
function putCover(element, book) {
  element.style.background = colorFor(book.title);
  const sources = coverSources(book);
  if (!sources.length) return;
  const img = document.createElement("img");
  img.className = "cover-img";
  img.alt = "";
  img.loading = "lazy";
  let n = 0;
  img.addEventListener("error", () => {
    n += 1;
    if (n < sources.length) img.src = sources[n];
    else img.remove();
  });
  // 中身のない小さな絵（1×1など）は表紙として使わない
  img.addEventListener("load", () => {
    if (img.naturalWidth < 20) img.dispatchEvent(new Event("error"));
    else element.classList.add("has-cover");
  });
  img.src = sources[0];
  element.prepend(img);
}

// 候補の本を並べる（onPick: 選んだとき、plainLabel/onPlain: 候補を使わないとき）
function showResults(area, found, onPick, plainLabel, onPlain) {
  area.hidden = false;
  area.innerHTML = '<p class="results-note">この本ですか？</p>';
  const list = document.createElement("div");
  list.className = "results";
  for (const info of found) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "result";
    const cover = document.createElement("div");
    cover.className = "mini-cover";
    putCover(cover, info);
    const text = document.createElement("div");
    text.className = "seed-text";
    const title = document.createElement("p");
    title.className = "seed-title";
    title.textContent = info.title;
    const meta = document.createElement("p");
    meta.className = "result-meta";
    meta.textContent = [info.author, info.publisher, info.year].filter(Boolean).join("・");
    text.append(title, meta);
    button.append(cover, text);
    button.addEventListener("click", () => onPick(info));
    list.appendChild(button);
  }
  area.appendChild(list);
  const plain = document.createElement("button");
  plain.type = "button";
  plain.className = "plain-add";
  plain.textContent = plainLabel;
  plain.addEventListener("click", onPlain);
  area.appendChild(plain);
  const credit = document.createElement("p");
  credit.className = "credit";
  credit.textContent = "本の情報：Google Books　表紙：Google Books・国立国会図書館サーチ";
  area.appendChild(credit);
}

// ---------- 記録をまもる（ファイルに書き出す・ファイルから戻す） ----------

const BACKUP_KEY = "k-library-backup-at";

function fileDate(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function renderBackupWhen() {
  const last = loadSetting(BACKUP_KEY, "");
  const area = document.getElementById("backup-when");
  if (!last) {
    area.textContent = books.length ? "まだ書き出したことはありません" : "";
    return;
  }
  const days = Math.floor((Date.now() - new Date(last)) / 86400000);
  area.textContent = `前回の書き出し：${formatDate(last)}` +
    (days >= 30 ? "（そろそろ、また書き出しておきませんか？）" : "");
}

document.getElementById("backup-out").addEventListener("click", async () => {
  const now = new Date();
  const data = { app: "K.Library", version: 1, exportedAt: now.toISOString(), books: books };
  const name = `K-Library-kiroku-${fileDate(now)}.json`;
  const file = new File([JSON.stringify(data, null, 2)], name, { type: "application/json" });

  try {
    // iPhoneでは「共有」の画面が開き、「"ファイル"に保存」を選べる
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: name });
    } else {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }
  } catch (e) {
    // 共有の画面で「キャンセル」したときは、なにもしない
    if (e && e.name === "AbortError") return;
    showToast("書き出せませんでした。もう一度ためしてください");
    return;
  }
  saveSetting(BACKUP_KEY, now.toISOString());
  renderBackupWhen();
  showToast(`${books.length}冊の記録を書き出しました`);
});

// 読みこんだ本が、ちゃんとした形かどうか確かめる
function cleanBook(raw) {
  if (!raw || typeof raw.title !== "string" || !raw.title.trim()) return null;
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : newId(),
    title: raw.title.trim(),
    author: typeof raw.author === "string" ? raw.author : "",
    isbn: typeof raw.isbn === "string" ? raw.isbn : "",
    cover: typeof raw.cover === "string" && raw.cover.startsWith("https://") ? raw.cover : "",
    status: statuses[raw.status] ? raw.status : "seed",
    member: people[raw.member] ? raw.member : "all",
    favorite: raw.favorite === true,
    addedAt: isNaN(new Date(raw.addedAt)) ? new Date().toISOString() : raw.addedAt,
  };
}

// いまの記録は消さずに、ファイルにあってiPhoneにない本だけを足す
document.getElementById("backup-file").addEventListener("change", async (event) => {
  const input = event.target;
  const file = input.files && input.files[0];
  input.value = "";
  if (!file) return;

  let incoming;
  try {
    const data = JSON.parse(await file.text());
    incoming = (Array.isArray(data) ? data : data.books).map(cleanBook).filter(Boolean);
  } catch (e) {
    showToast("K.Libraryの記録ファイルではないようです");
    return;
  }

  const have = new Set(books.map((book) => book.id));
  const added = incoming.filter((book) => !have.has(book.id));
  if (!added.length) {
    showToast("ファイルの本は、もう全部この中にあります");
    return;
  }
  const before = books.slice();
  books = books.concat(added);
  if (!saveBooks()) {
    books = before;
    return;
  }
  render();
  showToast(`${added.length}冊の記録を戻しました`, {
    label: "もとに戻す",
    run: () => {
      books = before;
      saveBooks();
      render();
    },
  });
});

// ---------- 画面に表示する ----------

const coverColors = ["#3E5A7A", "#C9783E", "#6F8F5E", "#8A5A7A", "#B8963E", "#4A6B6B", "#A0574A"];

// タイトルから毎回同じ色を選ぶ（仮の表紙の色）
function colorFor(text) {
  let sum = 0;
  for (const ch of text) sum += ch.codePointAt(0);
  return coverColors[sum % coverColors.length];
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function renderCounts() {
  const list = visibleBooks();
  const count = (status) => list.filter((book) => book.status === status).length;
  document.getElementById("count-seed").textContent = count("seed");
  document.getElementById("count-reserved").textContent = count("reserved");
  document.getElementById("count-borrowed").textContent = count("borrowed");
  document.getElementById("count-met").textContent = count("met");
}

function renderSeedFor() {
  const who = people[currentMember];
  document.getElementById("seed-for").textContent =
    currentMember === "all" ? "家族の本のたねとして迎えます" : `${who.name}の本のたねとして迎えます`;
}

let currentStatus = "seed";

function renderChips() {
  const area = document.getElementById("chips");
  area.innerHTML = "";
  const list = visibleBooks();
  for (const [key, info] of Object.entries(statuses)) {
    const chip = document.createElement("a");
    chip.className = "chip";
    chip.href = `#${info.hash}`;
    const n = list.filter((book) => book.status === key).length;
    chip.textContent = `${info.name} ${n}`;
    if (key === currentStatus) {
      chip.classList.add("selected");
      chip.setAttribute("aria-current", "page");
    }
    area.appendChild(chip);
  }
}

function renderSeedList() {
  const info = statuses[currentStatus];
  const shown = visibleBooks().filter((book) => book.status === currentStatus);
  const list = document.getElementById("seed-list");
  list.innerHTML = "";

  document.getElementById("list-title").textContent = info.name;
  document.getElementById("list-icon").src = info.icon;
  document.getElementById("list-lead").textContent = info.lead;
  document.getElementById("empty-text").innerHTML = info.empty;
  document.getElementById("tane-who").textContent =
    (currentMember === "all" ? "家族みんなの" : `${people[currentMember].name}の`) + `${info.name}　${shown.length}冊`;
  document.getElementById("seed-empty").hidden = shown.length > 0;
  renderChips();

  for (const book of shown) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "seed-item";
    button.setAttribute("aria-label", `『${book.title}』を開く`);
    button.addEventListener("click", () => openSheet(book.id));

    const cover = document.createElement("div");
    cover.className = "mini-cover";
    putCover(cover, book);

    const text = document.createElement("div");
    text.className = "seed-text";
    const title = document.createElement("p");
    title.className = "seed-title";
    title.textContent = book.title;
    const meta = document.createElement("p");
    meta.className = "seed-meta";
    const who = people[book.member] || people.all;
    if (who.icon) {
      const icon = document.createElement("img");
      icon.src = who.icon;
      icon.alt = "";
      meta.appendChild(icon);
    }
    meta.append(`${who.name}・${formatDate(book.addedAt)}に迎えた`);
    text.append(title, meta);
    button.append(cover, text);

    if (book.favorite) {
      const star = document.createElement("img");
      star.className = "item-star";
      star.src = "images/star.png";
      star.alt = "お気に入り";
      button.appendChild(star);
    }

    const arrow = document.createElement("span");
    arrow.className = "item-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "›";
    button.appendChild(arrow);

    item.appendChild(button);
    list.appendChild(item);
  }
}

// ---------- 本の森（木の本棚） ----------

let moriFilter = "all";
const SHELF_COLUMNS = 3;

function renderMori() {
  const all = visibleBooks().filter((book) => book.status === "met" || book.status === "home");
  const shown = moriFilter === "star" ? all.filter((book) => book.favorite) : all;
  const shelf = document.getElementById("shelf");
  shelf.innerHTML = "";

  document.getElementById("mori-who").textContent =
    (currentMember === "all" ? "家族みんなの本" : `${people[currentMember].name}の本`) + `　${shown.length}冊`;
  document.getElementById("mori-empty").hidden = shown.length > 0;
  shelf.hidden = shown.length === 0;
  document.getElementById("mori-empty-text").innerHTML = moriFilter === "star"
    ? "お気に入りの星がついた本は、まだありません。"
    : "まだ本棚はからっぽです。<br>本を開いて「出会った本」にすると、ここに並びます。";

  // 3冊ずつ、1段の棚に並べる
  for (let i = 0; i < shown.length; i += SHELF_COLUMNS) {
    const row = document.createElement("div");
    row.className = "shelf-row";
    for (const book of shown.slice(i, i + SHELF_COLUMNS)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "shelf-book";
      button.setAttribute("aria-label", `『${book.title}』を開く`);
      button.addEventListener("click", () => openSheet(book.id));

      const title = document.createElement("span");
      title.className = "shelf-title";
      title.textContent = book.title;
      button.appendChild(title);
      putCover(button, book);

      if (book.favorite) {
        const star = document.createElement("img");
        star.className = "shelf-star";
        star.src = "images/star.png";
        star.alt = "お気に入り";
        button.appendChild(star);
      }
      const who = people[book.member];
      if (who && who.icon) {
        const icon = document.createElement("img");
        icon.className = "shelf-who";
        icon.src = who.icon;
        icon.alt = who.name;
        button.appendChild(icon);
      }
      row.appendChild(button);
    }
    shelf.appendChild(row);
  }
}

document.querySelectorAll(".mini-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    moriFilter = chip.dataset.filter;
    document.querySelectorAll(".mini-chip").forEach((c) => {
      const on = c === chip;
      c.classList.toggle("selected", on);
      c.setAttribute("aria-pressed", String(on));
    });
    renderMori();
  });
});

function render() {
  renderCounts();
  renderBackupWhen();
  renderMori();
  renderSeedFor();
  renderSeedList();
}

// ---------- 画面の切りかえ（今日 / 本の一覧 / 本の森） ----------

function showView() {
  const status = statusFromHash();
  const name = status ? "tane" : location.hash === "#mori" ? "mori" : "home";
  if (status) {
    currentStatus = status;
    renderSeedList();
  }
  closeSheet();
  document.getElementById("view-home").hidden = name !== "home";
  document.getElementById("view-tane").hidden = name !== "tane";
  document.getElementById("view-mori").hidden = name !== "mori";
  document.querySelectorAll(".tab[data-view]").forEach((tab) => {
    const active = tab.dataset.view === name;
    tab.classList.toggle("active", active);
    if (active) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", showView);

// ---------- まだ作っていないところ ----------

document.querySelectorAll("[data-soon]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(`「${link.dataset.soon}」は、もうすぐできます`);
  });
});

// ---------- はじめに一度だけ動かす ----------

selectMember(currentMember);
showView();

// ---------- 電波がないときも開けるようにする準備 ----------

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

// iPhoneに「この記録は大切なので消さないで」とお願いしておく
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist();
}
