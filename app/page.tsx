"use client";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);

  const submitImage = () => {
    if (!image) return;

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "ml_default");
    data.append("cloud_name", "dnspkqiue");

    fetch("https://api.cloudinary.com/v1_1/dnspkqiue/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Image uploaded to Cloudinary:", data);
        const imageUrl = data.secure_url; // Use secure_url instead of url
        saveImageUrl(imageUrl); // Send the URL to your backend
      })
      .catch((err) => {
        console.log("Error uploading image:", err);
      });
  };

  const saveImageUrl = (imageUrl: string) => {
    fetch("/api/saveImageUrl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Image URL saved:", data);
      })
      .catch((err) => {
        console.error("Error saving image URL:", err);
      });
  };

  return (
    <main>
      <div>
        <div>
          <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          <button onClick={submitImage}>Upload</button>
        </div>
      </div>
    </main>
  );
}
