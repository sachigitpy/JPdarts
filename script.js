document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("throwBtn");
  const result = document.getElementById("result");

  let cities = [];

  // cities_japan.json を読み込む
  fetch("cities_japan.json")
    .then(res => res.json())
    .then(data => {
      cities = data;
      console.log("都市データ読み込み完了:", cities.length);
    })
    .catch(err => console.error("JSON読み込みエラー:", err));

  // Leaflet 地図初期化（日本中心）
  const map = L.map("map").setView([37.7749, 139.2394], 5);

  // OpenStreetMap タイル
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  let marker; // 前回のマーカーを削除する用

  button.addEventListener("click", () => {
    if (cities.length === 0) {
      result.textContent = "データ読み込み中です…";
      return;
    }

    result.textContent = "🎰 抽選中…";

    setTimeout(() => {
      const city = cities[Math.floor(Math.random() * cities.length)];

      result.innerHTML = `<strong>${city.city_ja}</strong><br>${city.admin_name_ja}`;

      if (city.lat && city.lng) {
        // 前のマーカーを削除
        if (marker) map.removeLayer(marker);

        // 新しいマーカーを追加
        marker = L.marker([city.lat, city.lng])
          .addTo(map)
          .bindPopup(`<strong>${city.city_ja}</strong>`)
          .openPopup();

        // 都市にズーム
        map.setView([city.lat, city.lng], 10, { animate: true });
      }
    }, 1000);
  });

  // 地図描画補正
  window.onload = () => map.invalidateSize();
});
