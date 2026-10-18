// K.Library の動き

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

// 電波がないときも開けるようにする準備
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
