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
      <div className="container mx-auto p-4">
        <div className="flex items-center space-x-4 mb-4">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <select
            className="p-2 border rounded"
            onChange={(e) => setFileType(e.target.value)}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={submitFile}
          >
            Upload
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Uploaded Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="relative">
                {item.type === "image" ? (
                  <img src={item.url} alt={`media-${item.id}`} className="w-full h-auto" />
                ) : (
                  <video src={item.url} controls className="w-full h-auto" />
                )}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center space-y-2 opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity">
                  <button
                    className="bg-yellow-500 text-white font-bold py-1 px-2 rounded"
                    onClick={() => setEditId(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white font-bold py-1 px-2 rounded"
                    onClick={() => deleteFileUrl(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
