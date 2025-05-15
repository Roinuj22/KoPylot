export default async function handler(req, res) {
    const { plaque } = req.query;

    if (!plaque) {
        return res.status(400).json({ error: 'Immatriculation manquante' });
    }

    const apiKey = process.env.AFTERIIZE_API_KEY;
    const url = `https://api.afteriize.com/${apiKey}?reg_or_vin=${encodeURIComponent(plaque)}&reg_country=fr&country=fr`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data || data.error) {
            return res.status(404).json({ error: 'Véhicule non trouvé' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Erreur lors de l’appel API Afteriize :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}