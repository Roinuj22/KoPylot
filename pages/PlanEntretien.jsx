import React, { useState } from 'react';


export default function PlanEntretien() {
    const [plaque, setPlaque] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/afteriize?reg_or_vin=${plaque}`);
            const json = await res.json();
            console.log(" Données reçues :", json);
            setData(json);
        } catch (err) {
            console.error('Erreur API :', err);
        } finally {
            setLoading(false);
        }
    };

    const renderTable = (interval, title) => (
        <div className="interval-block">
            <h3>{title}</h3>
            <table className="entretien-table">
                <thead>
                <tr>
                    <th>Opération</th>
                    <th>Zone</th>
                    <th>Action</th>
                    <th>Fréquence</th>
                </tr>
                </thead>
                <tbody>
                {interval?.interval_operations?.map((op, idx) => (
                    <tr key={idx}>
                        <td>{op.operation_description}</td>
                        <td>{op.operation_header}</td>
                        <td>{op.operation_action}</td>
                        <td>
                            {interval.interval_kms ? `${interval.interval_kms} km` : ''}
                            {interval.interval_kms && interval.interval_months ? ' / ' : ''}
                            {interval.interval_months ? `${interval.interval_months} mois` : ''}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="plan-entretien">
            <h1>Plan d'entretien</h1>
            <form onSubmit={handleSubmit} className="form-plaque">
                <input
                    type="text"
                    value={plaque}
                    onChange={(e) => setPlaque(e.target.value.toUpperCase())}
                    placeholder="Entrez votre plaque d'immatriculation"
                    required
                />
                <button type="submit" disabled={loading}>{loading ? 'Chargement...' : 'Valider'}</button>
            </form>

            {data && data.car_identification && (
                <div className="vehicule-info">
                    <h2>{data.car_identification.brand} {data.car_identification.model}</h2>
                    <p><strong>Version :</strong> {data.car_identification.version}</p>
                    <p><strong>Date de mise en circulation :</strong> {data.car_identification.date_pme}</p>
                </div>
            )}

            {data && data.maintenance_intervals && (
                <div className="entretiens">
                    {data.maintenance_intervals.previous && renderTable(data.maintenance_intervals.previous, 'Opérations complémentaires')}
                    {data.maintenance_intervals.current && renderTable(data.maintenance_intervals.current, 'Opérations systématiques')}
                </div>
            )}
        </div>
    );
}