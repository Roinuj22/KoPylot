export default async function handler(req, res) {
    const { reg_or_vin } = req.query;

    if (!reg_or_vin) {
        return res.status(400).json({ error: 'Paramètre "reg_or_vin" requis' });
    }

    const url = `https://api.afteriize.com/e928bd20567644df9e70f8b6cd434ee7` +
        `?reg_or_vin=${reg_or_vin}` +
        `&reg_country=fr&country=fr&mileage=50000&age=48&mode=top3&apikey=cce27bae58fd15d5b4c9eac106c512e7`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Erreur appel API Afteriize :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
