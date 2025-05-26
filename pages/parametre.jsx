import React, { useEffect, useState } from "react";
import { useTheme } from "../components/ThemeContext";

export default function ParametresPage() {
    const [language, setLanguage] = useState("fr");
    const [notifications, setNotifications] = useState({ sms: false, email: false, push: false });
    const { theme, toggleTheme } = useTheme();

    // Récupère les données du localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const savedLang = localStorage.getItem("language");
        const savedNotif = JSON.parse(localStorage.getItem("notifications"));

        if (savedTheme) document.body.className = savedTheme;
        if (savedLang) setLanguage(savedLang);
        if (savedNotif) setNotifications(savedNotif);
    }, []);

    // Enregistre les notifications dans localStorage dès qu'elles changent
    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }, [notifications]);

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const toggleNotification = (type) => {
        setNotifications((prev) => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    return (
        <div className="parametres-page">
            <h1>Paramètres</h1>

            <div className="section">
                <h3>Comment souhaitez-vous être notifié ?</h3>
                <div className="switch-list">
                    <label data-testid="notif-sms-label">
                        <input
                            type="checkbox"
                            data-testid="notif-sms"
                            checked={notifications.sms}
                            onChange={() => toggleNotification('sms')}
                        />
                        <span className="switch"></span>
                        SMS
                    </label>
                    <label data-testid="notif-email-label">
                        <input
                            type="checkbox"
                            data-testid="notif-email"
                            checked={notifications.email}
                            onChange={() => toggleNotification('email')}
                        />
                        <span className="switch"></span>
                        Email
                    </label>
                </div>
            </div>

            <div className="section">
                <h3>Langue</h3>
                <select value={language} onChange={handleLanguageChange}>
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                </select>
            </div>

            <div className="section">
                <h3>Thème</h3>
                <div className="theme-toggle" onClick={toggleTheme}>
                    <span className={theme === "light" ? "active" : ""}>☀️</span>
                    <div className="toggle-switch">
                        <div className={`circle ${theme}`}></div>
                    </div>
                    <span className={theme === "dark" ? "active" : ""}>🌙</span>
                </div>
            </div>
        </div>
    );
}