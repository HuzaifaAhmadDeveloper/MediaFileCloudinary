"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("image");
  const [media, setMedia] = useState<{ id: number; url: string; type: string }[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/getUrl")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched media:", data);
        setMedia(data);
      })
      .catch((err) => {
        console.error("Error fetching media:", err);
      });
  }, []);

  const submitFile = () => {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ml_default");
    data.append("cloud_name", "dnspkqiue");

    const endpoint =
      fileType === "video"
        ? "https://api.cloudinary.com/v1_1/dnspkqiue/video/upload"
        : "https://api.cloudinary.com/v1_1/dnspkqiue/image/upload";

    fetch(endpoint, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`${fileType} uploaded to Cloudinary:`, data);
        const fileUrl = data.secure_url; // Use secure_url instead of url
        if (editId) {
          updateFileUrl(editId, fileUrl, fileType);
        } else {
          saveFileUrl(fileUrl, fileType); // Send the URL and type to your backend
        }
      })
      .catch((err) => {
        console.log(`Error uploading ${fileType}:`, err);
      });
  };

  const saveFileUrl = (fileUrl: string, fileType: string) => {
    console.log(`Saving ${fileType} URL:`, fileUrl);
    fetch("/api/saveImageUrl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileUrl, fileType }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`${fileType} URL saved:`, data);
        fetchMedia();
      })
      .catch((err) => {
        console.error(`Error saving ${fileType} URL:`, err);
      });
  };

  const updateFileUrl = (id: number, fileUrl: string, fileType: string) => {
    fetch("/api/updateUrl", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, fileUrl, fileType }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`${fileType} URL updated:`, data);
        fetchMedia();
      })
      .catch((err) => {
        console.error(`Error updating ${fileType} URL:`, err);
      });
  };

  const deleteFileUrl = (id: number) => {
    fetch("/api/deleteUrl", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`URL deleted:`, data);
        fetchMedia();
      })
      .catch((err) => {
        console.error(`Error deleting URL:`, err);
      });
  };

  const fetchMedia = () => {
    fetch("/api/getUrl")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched media:", data);
        setMedia(data);
        setEditId(null);
      })
      .catch((err) => {
        console.error("Error fetching media:", err);
      });
  };

  return (
    <main>
      <div>
        <div>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <select onChange={(e) => setFileType(e.target.value)}>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <button onClick={submitFile}>Upload</button>
        </div>
        <div>
          <h2>Uploaded Media</h2>
          {media.map((item) => (
            <div key={item.id}>
              {item.type === "image" ? (
                <img src={item.url} alt={`media-${item.id}`} width="200" />
              ) : (
                <video src={item.url} controls width="200" />
              )}
              <button className="bg-red-500 text-white font-bold m-5 p-3 rounded-md" onClick={() => setEditId(item.id)}>Edit</button>
              <button className="bg-red-500 text-white font-bold m-5 p-3 rounded-md" onClick={() => deleteFileUrl(item.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
