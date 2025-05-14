import React, { useEffect, useState } from "react";
import {useTheme} from "../components/ThemeContext";

export default function ParametresPage() {

    const [language, setLanguage] = useState("fr");
    const [notifications, setNotifications] = useState({ sms: false, email: false, push: false });

    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const savedLang = localStorage.getItem("language");
        const savedNotif = JSON.parse(localStorage.getItem("notifications"));


        if (savedLang) setLanguage(savedLang);
        if (savedNotif) setNotifications(savedNotif);
    }, []);

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

/*    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };*/

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const toggleNotification = (type) => {
        const updated = { ...notifications, [type]: !notifications[type] };
        setNotifications(updated);
        localStorage.setItem("notifications", JSON.stringify(updated));
    };

    return (
        <div className="parametres-page">
            <h1>Paramètres</h1>

            <div className="section">
                <h3>Comment souhaitez-vous être notifié ?</h3>
                <div className="switch-list">
                    <label>
                        <input type="checkbox" checked={notifications.sms} onChange={() => toggleNotification('sms')} />
                        <span className="switch"></span>
                        SMS
                    </label>
                    <label>
                        <input type="checkbox" checked={notifications.email} onChange={() => toggleNotification('email')} />
                        <span className="switch"></span>
                        Email
                    </label>
                    <label>
                        <input type="checkbox" checked={notifications.push} onChange={() => toggleNotification('push')} />
                        <span className="switch"></span>
                        Notification push via l'application
                    </label>
                </div>
            </div>

            <div className="section">
                <h3>Langue</h3>
                <select value={language} onChange={handleLanguageChange}>
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
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