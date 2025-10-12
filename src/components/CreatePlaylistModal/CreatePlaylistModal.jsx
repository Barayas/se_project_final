import React, { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import defaultCover from "../../assets/default-playlist.png";
import "./CreatePlaylistModal.css";

export default function CreatePlaylistModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverData, setCoverData] = useState(null);
  const [preview, setPreview] = useState(defaultCover);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverData(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverData(null);
      setPreview(defaultCover);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name, description, cover: coverData || null });
    onClose();
  };

  return (
    <ModalWithForm
      title="Create New Playlist"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText="Create"
    >
      <label>
        Playlist Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Description (optional):
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Cover Image (optional):
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      <div className="playlist-preview">
        <p>Preview:</p>
        <img
          src={preview}
          alt="Playlist Preview"
          className="playlist-preview-img"
        />
      </div>
    </ModalWithForm>
  );
}
