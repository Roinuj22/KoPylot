import React, { useEffect, useState } from "react";


export default function ProfilPage() {
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [editField, setEditField] = useState(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        const userData = localStorage.getItem("kopylotUser");
        if (userData) setUser(JSON.parse(userData));
    }, []);

    useEffect(() => {
        const userData = localStorage.getItem("kopylotUser");
        const savedImage = localStorage.getItem("kopylotAvatar");

        if (userData) setUser(JSON.parse(userData));
        if (savedImage) setImage(savedImage);
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
                localStorage.setItem("kopylotAvatar", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteAccount = () => {
        if (deleteReason.trim()) {
            localStorage.removeItem("kopylotUser");
            setShowDeletePopup(false);
            setShowSuccessPopup(true);
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        }
    };

    const handleChange = (field, value) => {
        const updatedUser = { ...user, [field]: value };
        setUser(updatedUser);
        localStorage.setItem("kopylotUser", JSON.stringify(updatedUser));
    };

    const openEditPopup = (field, currentValue) => {
        setEditField(field);
        setEditValue(currentValue);
    };

    const handleSaveEdit = () => {
        handleChange(editField, editValue);
        setEditField(null);
        setEditValue("");
    };

    if (!user) return <div className="profil-page">Chargement...</div>;

    return (
        <div className="profil-page">
            <h1>Mon profil</h1>

            <div className="profil-header">
                <img
                    src={image || "/default-avatar.png"}
                    alt="avatar"
                    className="avatar"
                />
                <label className="photo-button">
                    Changer photo
                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                </label>
            </div>

            <div className="profil-section">
                <h2>Informations Personnelles <span className="edit-icon" onClick={() => openEditPopup('infos', '')}>✎</span></h2>
                <div className="profil-grid-2col">
                    <div>
                        <label>Nom</label>
                        <input type="text" value={user.nom} disabled />
                    </div>
                    <div>
                        <label>Prénom</label>
                        <input type="text" value={user.prenom} disabled />
                    </div>
                </div>
                <div className="profil-grid-2col">
                    <div>
                        <label>Date de naissance</label>
                        <input type="date" value={user.naissance || ''} disabled />
                    </div>
                    <div>
                        <label>Téléphone</label>
                        <input type="tel" value={user.telephone || ''} disabled />
                    </div>
                </div>
                <div>
                    <label>Adresse mail</label>
                    <input type="email" value={user.email} disabled className="full-width" />
                </div>
            </div>

            <div className="profil-section">
                <h2>Sécurité <span className="edit-icon" onClick={() => openEditPopup('securite', '')}>✎</span></h2>
                <div className="profil-grid-2col">
                    <div>
                        <label>Adresse mail</label>
                        <input type="email" value={user.email} disabled />
                    </div>
                    <div>
                        <label>Mot de passe</label>
                        <input type="password" value={user.password || ''} disabled />
                    </div>
                </div>
            </div>

            <div className="profil-section">
                <h2>Adresse <span className="edit-icon" onClick={() => openEditPopup('adresse', '')}>✎</span></h2>
                <div className="profil-grid-2col">
                    <div>
                        <label>Ville</label>
                        <input type="text" value={user.ville || ''} disabled />
                    </div>
                    <div>
                        <label>Code Postal</label>
                        <input type="text" value={user.codePostal || ''} disabled />
                    </div>
                </div>
                <div>
                    <label>Pays</label>
                    <input type="text" value={user.pays || ''} disabled className="full-width" />
                </div>
            </div>

            <div className="button-container">
                <button className="delete-button-fixed" onClick={() => setShowDeletePopup(true)}>
                    Supprimer compte
                </button>
            </div>

            {showDeletePopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Pourquoi voulez-vous supprimer votre compte ?</h3>
                        <textarea
                            placeholder="Votre raison..."
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                        />
                        <div className="popup-actions">
                            <button className="cancel" onClick={() => setShowDeletePopup(false)}>Annuler</button>
                            <button className="confirm" onClick={handleDeleteAccount}>Confirmer</button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Compte supprimé avec succès ✅</h3>
                    </div>
                </div>
            )}

            {editField && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Modifier {editField === 'infos' ? 'les informations personnelles' : editField === 'securite' ? 'la sécurité' : 'l’adresse'}</h3>
                        <div className="edit-form">
                            {editField === 'infos' && (
                                <>
                                    <input type="text" placeholder="Nom" value={user.nom} onChange={(e) => handleChange('nom', e.target.value)} />
                                    <input type="text" placeholder="Prénom" value={user.prenom} onChange={(e) => handleChange('prenom', e.target.value)} />
                                    <input type="date" placeholder="Date de naissance" value={user.naissance || ''} onChange={(e) => handleChange('naissance', e.target.value)} />
                                    <input type="tel" placeholder="Téléphone" value={user.telephone || ''} onChange={(e) => handleChange('telephone', e.target.value)} />
                                    <input type="email" placeholder="Adresse mail" value={user.email} onChange={(e) => handleChange('email', e.target.value)} />
                                </>
                            )}

                            {editField === 'securite' && (
                                <>
                                    <input type="email" placeholder="Adresse mail" value={user.email} onChange={(e) => handleChange('email', e.target.value)} />
                                    <input type="password" placeholder="Mot de passe" value={user.password || ''} onChange={(e) => handleChange('password', e.target.value)} />
                                </>
                            )}

                            {editField === 'adresse' && (
                                <>
                                    <input type="text" placeholder="Ville" value={user.ville || ''} onChange={(e) => handleChange('ville', e.target.value)} />
                                    <input type="text" placeholder="Code postal" value={user.codePostal || ''} onChange={(e) => handleChange('codePostal', e.target.value)} />
                                    <input type="text" placeholder="Pays" value={user.pays || ''} onChange={(e) => handleChange('pays', e.target.value)} />
                                </>
                            )}
                        </div>

                        <div className="popup-actions">
                            <button className="cancel" onClick={() => setEditField(null)}>Annuler</button>
                            <button className="confirm" onClick={() => setEditField(null)}>Sauvegarder</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}