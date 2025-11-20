"use client";

import { useState, FormEvent } from "react";

export default function LocationForm() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 入力値を数値に変換
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      alert("緯度・経度は数値で入力してください");
      return;
    }

    // API に送信するデータ
    const body = {
      locations: [
        {
          name: name,
          lat: latNum,
          lng: lngNum,
        },
      ],
    };

    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("送信失敗");

      const data = await res.json();
      console.log("送信成功:", data);
      alert("送信完了！");
      setLat("");
      setLng("");
    } catch (err) {
      console.error(err);
      alert("送信中にエラーが発生しました");
    }
  };

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh", padding: "2rem", color: "#000" }}>
      <h1>場所登録フォーム</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>

      <div style={{ marginBottom: "1rem" }}>
  <label htmlFor="name" style={{ marginRight: "0.5rem" }}>場所名</label>
  <input
    type="text"
    id="name"
    value={name}
    onChange={(e) => setName(e.target.value)} // ✅ ここを修正
    required
    style={{
      color: "#000",
      border: "2px solid #1E90FF",
      borderRadius: "4px",
      padding: "0.4rem 0.6rem",
    }}
  />
</div>

        
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="lat" style={{ marginRight: "0.5rem" }}>緯度:</label>
          <input
            type="text"
            id="lat"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
            style={{
              color: "#000",
              border: "2px solid #1E90FF",
              borderRadius: "4px",
              padding: "0.4rem 0.6rem",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="lng" style={{ marginRight: "0.5rem" }}>経度:</label>
          <input
            type="text"
            id="lng"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            required
            style={{
              color: "#000",
              border: "2px solid #1E90FF",
              borderRadius: "4px",
              padding: "0.4rem 0.6rem",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#32CD32",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          登録
        </button>
      </form>
    </div>
  );
}
