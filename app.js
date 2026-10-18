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
//   author:    著者（あとで書籍情報から入れる）
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

document.getElementById("seed-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("seed-input");
  const title = input.value.trim();
  if (!title) {
    showToast("気になった本のタイトルを入れてください");
    input.focus();
    return;
  }
  books.unshift({
    id: newId(),
    title: title,
    author: "",
    status: "seed",
    member: currentMember,
    favorite: false,
    addedAt: new Date().toISOString(),
  });
  if (!saveBooks()) {
    books.shift();
    return;
  }
  input.value = "";
  input.blur();
  render();
  showToast(`『${title}』を本のたねとして迎えました`);
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
  document.getElementById("sheet-cover").style.background = colorFor(book.title);
  document.getElementById("sheet-title").textContent = book.title;
  document.getElementById("sheet-date").textContent = `${formatDate(book.addedAt)}に迎えた本`;

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

document.getElementById("sheet-remove").addEventListener("click", () => {
  const id = openBookId;
  closeSheet();
  removeBook(id);
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
    cover.style.background = colorFor(book.title);

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

function render() {
  renderCounts();
  renderSeedFor();
  renderSeedList();
}

// ---------- 画面の切りかえ（今日 / 本の一覧） ----------

function showView() {
  const status = statusFromHash();
  const name = status ? "tane" : "home";
  if (status) {
    currentStatus = status;
    renderSeedList();
  }
  closeSheet();
  document.getElementById("view-home").hidden = name !== "home";
  document.getElementById("view-tane").hidden = name !== "tane";
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
