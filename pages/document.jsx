import React, { useState, useEffect, useRef } from "react";

const categories = [
    "Document administratif",
    "Document financier",
    "Autre",
];

export default function DocumentPage() {
    const [documents, setDocuments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [previewDoc, setPreviewDoc] = useState(null);
    const [formData, setFormData] = useState({
        category: categories[0],
        name: "",
        file: null,
        fileBase64: "",
        type: "",
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        const storedDocs = JSON.parse(localStorage.getItem("documents")) || [];
        setDocuments(storedDocs);
    }, []);

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const base64 = await toBase64(file);
        setFormData({
            ...formData,
            file,
            fileBase64: base64,
            type: file.type,
        });
    };

    const handleSave = () => {
        const newDoc = {
            id: Date.now(),
            name: formData.name,
            category: formData.category,
            fileBase64: formData.fileBase64,
            type: formData.type,
        };
        const updatedDocs = [...documents, newDoc];
        localStorage.setItem("documents", JSON.stringify(updatedDocs));
        setDocuments(updatedDocs);
        setShowModal(false);
        setFormData({ category: categories[0], name: "", file: null, fileBase64: "", type: "" });
    };

    const handleDelete = (id) => {
        const updated = documents.filter((doc) => doc.id !== id);
        localStorage.setItem("documents", JSON.stringify(updated));
        setDocuments(updated);
        setPreviewDoc(null);
    };

    const handleReplace = async (e) => {
        const file = e.target.files[0];
        if (!file || !previewDoc) return;
        const base64 = await toBase64(file);
        const updatedDocs = documents.map((doc) =>
            doc.id === previewDoc.id
                ? { ...doc, fileBase64: base64, type: file.type }
                : doc
        );
        localStorage.setItem("documents", JSON.stringify(updatedDocs));
        setDocuments(updatedDocs);
        const updatedPreview = updatedDocs.find((d) => d.id === previewDoc.id);
        setPreviewDoc(updatedPreview);
    };

    const groupedDocs = {
        "Document administratif": [],
        "Document financier": [],
        Autre: [],
    };

    documents.forEach((doc) => groupedDocs[doc.category].push(doc));

    return (
        <div className="container">
            <div className="header">
                <h1 className="title">Documents</h1>
                <div className="header-actions">
                    <button className="link" onClick={() => alert("Voir tout")}>Voir tout</button>
                    <button className="link" onClick={() => setShowModal(true)}>Ajouter un document</button>
                </div>
            </div>

            {Object.entries(groupedDocs).map(([cat, docs]) => (
                <div key={cat} className="category-block">
                    <h2 className="category-title with-margin">{cat + "s"}</h2>
                    <div className="document-list">
                        {docs.map((doc) => (
                            <div key={doc.id} className="document-card">
                                <div className="document-preview">
                                    {doc.type === 'application/pdf' ? (
                                        <span className="preview-text">📄 PDF</span>
                                    ) : doc.fileBase64 ? (
                                        <img src={doc.fileBase64} alt="preview" className="thumb" />
                                    ) : (
                                        <span className="preview-text">photo preview</span>
                                    )}
                                </div>
                                <div className="document-name">{doc.name}</div>
                                <button className="preview-icon" onClick={() => setPreviewDoc(doc)}>🔍</button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal large-modal">
                        <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                        <h2 className="modal-title">Ajouter un document</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Catégorie</label>
                                <select
                                    className="form-select"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nom document</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-file">
                            <input type="file" onChange={handleImport} className="file-input" />
                            <button className="import-button" disabled>
                                Importer document
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button className="save-button" onClick={handleSave}>Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}

            {previewDoc && (
                <div className="modal-overlay">
                    <div className="preview-modal full-size">
                        <button className="close-button" onClick={() => setPreviewDoc(null)}>✕</button>
                        <div className="preview-controls">
                            <button className="replace-button" onClick={() => fileInputRef.current.click()}>Remplacer</button>
                            <button className="delete-button" onClick={() => handleDelete(previewDoc.id)}>Supprimer</button>
                            <input
                                type="file"
                                accept="application/pdf,image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleReplace}
                            />
                        </div>
                        {previewDoc.type === 'application/pdf' ? (
                            <embed src={previewDoc.fileBase64} type="application/pdf" className="full-preview pdf-preview" />
                        ) : (
                            <img src={previewDoc.fileBase64} alt="Aperçu du document" className="full-preview image-preview" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}