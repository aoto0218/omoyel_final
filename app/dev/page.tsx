"use client";

import { useState, FormEvent } from "react";

export default function LocationForm() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("送信する緯度:", lat, "経度:", lng);
  };

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh", padding: "2rem", color: "#000" }}>
      <h1>場所登録フォーム</h1>


      <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="lng" style={{ marginRight: "0.5rem" }}>タイトル</label>
          <input
            type="text"
            id="lng"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            required
            style={{
              color: "#000",
              border: "2px solid #1E90FF",  // 枠線色
              borderRadius: "4px",
              padding: "0.4rem 0.6rem",
            }}
          />
        </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
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
              border: "2px solid #1E90FF",  // 枠線色
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
              border: "2px solid #1E90FF",  // 枠線色
              borderRadius: "4px",
              padding: "0.4rem 0.6rem",
            }}
          />
        </div>

        

        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#32CD32", // ボタン背景色
            color: "#fff",              // ボタン文字色
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
