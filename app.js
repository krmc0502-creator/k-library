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
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// ---------- だれの本？（選んだ人をiPhoneに覚えておく） ----------

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

const members = document.querySelectorAll(".member");

function selectMember(id) {
  members.forEach((button) => {
    const isSelected = button.dataset.member === id;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  saveSetting("k-library-member", id);
}

members.forEach((button) => {
  button.addEventListener("click", () => selectMember(button.dataset.member));
});

selectMember(loadSetting("k-library-member", "all"));

// ---------- まだ作っていないところ ----------

document.getElementById("seed-button").addEventListener("click", () => {
  showToast("迎える機能は、次の段階でできあがります");
});

document.querySelectorAll("[data-soon]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(`「${link.dataset.soon}」は、もうすぐできます`);
  });
});

// ---------- 電波がないときも開けるようにする準備 ----------

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
