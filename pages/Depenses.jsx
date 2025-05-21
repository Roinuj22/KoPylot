import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DepensePage() {
    const [depenses, setDepenses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [formData, setFormData] = useState({
        titre: "",
        categorie: "Carburant/Recharge électrique",
        montant: "",
        date: new Date().toISOString().split("T")[0],
    });

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        const updated = depenses.filter((d) => !selectedIds.includes(d.id));
        localStorage.setItem("depenses", JSON.stringify(updated));
        setDepenses(updated);
        setSelectedIds([]);
        setSelectionMode(false);
    };


    const categories = [
        "Carburant/Recharge électrique",
        "Entretiens et Réparations",
        "Assurance",
        "Contrôle technique/Contrôle visite",
        "Péage/Stationnement",
        "Lavage/Nétoyage",
        "Equipement et accéssoire",
        "Pièces détachées",
        "Dépréciation ou frais exceptionnel",
        "Autre"
    ];

    const COLORS = [
        "#007BFF",
        "#339AF0",
        "#5C7CFA",
        "#4C6EF5",
        "#3B5BDB",
        "#3A86FF",
        "#2F80ED",
        "#1C7ED6",
        "#1864AB",
        "#0B5394"
    ];

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("depenses")) || [];
        setDepenses(stored);

        if (typeof window !== "undefined") {
            setIsMobile(window.innerWidth < 768);
            const handleResize = () => setIsMobile(window.innerWidth < 768);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    const handleSave = () => {
        const newDepense = { ...formData, id: Date.now() };
        const updated = [...depenses, newDepense];
        localStorage.setItem("depenses", JSON.stringify(updated));
        setDepenses(updated);
        setShowModal(false);
        setFormData({ titre: "", categorie: "Carburant/Recharge électrique", montant: "", date: new Date().toISOString().split("T")[0] });
    };

    const handleDelete = (id) => {
        const updated = depenses.filter((d) => d.id !== id);
        localStorage.setItem("depenses", JSON.stringify(updated));
        setDepenses(updated);
    };

    const total = depenses.reduce((sum, d) => sum + parseFloat(d.montant || 0), 0);
    const moyenne = depenses.length ? total / depenses.length : 0;

    const groupedData = categories.map((cat) => {
        const value = depenses
            .filter((d) => d.categorie === cat)
            .reduce((sum, d) => sum + parseFloat(d.montant || 0), 0);
        return { name: cat, value };
    }).filter(d => d.value > 0);

    return (
        <div className="container" style={{ padding: '1.5rem' }}>
            <div className="header">
                <h1 className="title">Suivi des dépenses</h1>
                <div className="header-actions">
                    <button className="link" onClick={() => setShowModal(true)}>Ajouter une dépense</button>
                    <button className="export-button" onClick={() => window.print()}>Exporter PDF</button>
                </div>
            </div>

            <div className="summary" style={{ gap: '1.5rem', flexWrap: 'wrap' }}>
                <div className="card" style={{ flex: 1, minWidth: 250 }}>
                    <p>Dépenses totales</p>
                    <h2>{total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</h2>
                    <button onClick={() => setSelectionMode(!selectionMode)} className="link">
                        {selectionMode ? "Annuler la sélection" : "Gérer les dépenses"}
                    </button>

                    {selectionMode && (
                        <>
                            <button onClick={handleDeleteSelected} className="delete-button" disabled={selectedIds.length === 0}>
                                Supprimer ({selectedIds.length})
                            </button>
                            <div className="item-list" style={{ marginTop: '1rem' }}>
                                {depenses.map((d) => (
                                    <div key={d.id} className="item">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(d.id)}
                                            onChange={() => toggleSelect(d.id)}
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        <span>{d.titre} — {parseFloat(d.montant).toFixed(2)} €</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="card" style={{ flex: 1, minWidth: 250 }}>
                    <p>Dépenses moyennes <i>(par mois)</i></p>
                    <h2>{moyenne.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</h2>
                </div>
            </div>

            <div className="chart-section" style={{ margin: '2rem 0' }}>
                <div className="card" style={{ padding: '1rem' }}>
                    <h2 style={{ textAlign: 'center' }}>Dépenses par catégories</h2>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={groupedData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={isMobile ? 70 : 100}
                                    label={!isMobile}
                                >
                                    {groupedData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value.toFixed(2)} €`} />
                                <Legend
                                    layout={isMobile ? "horizontal" : "vertical"}
                                    align={isMobile ? "center" : "right"}
                                    verticalAlign={isMobile ? "bottom" : "middle"}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="recent-section">

                <div className="card list" style={{ padding: '1rem' }}>
                    <h2 style={{ textAlign: 'center' }}>Dépenses récentes</h2>
                    {depenses.map((d) => (
                        <div key={d.id} className="item">
                            <span>{d.titre}</span>
                            <span>{d.categorie}</span>
                            <span>{parseFloat(d.montant).toFixed(2)} €</span>
                            <span>{d.date}</span>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal large-modal">
                        <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                        <h2 className="modal-title">Ajouter une dépense</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Titre</label>
                                <input type="text" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value })} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label>Catégorie</label>
                                <select value={formData.categorie} onChange={(e) => setFormData({ ...formData, categorie: e.target.value })} className="form-select">
                                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Montant</label>
                                <input type="number" value={formData.montant} onChange={(e) => setFormData({ ...formData, montant: e.target.value })} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="form-input" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="save-button" onClick={handleSave}>Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
