import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner, Alert, Row, Col, Card } from 'react-bootstrap';
import { factureService } from '../services/factureService';

const FacturesPage = () => {
    const [factures, setFactures] = useState([]);
    const [rapport, setRapport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let facturesData = [];
                let rapportData = null;
                
                try {
                    const facturesRes = await factureService.getAll();
                    // ✅ Vérifier que facturesRes.data est un tableau
                    if (Array.isArray(facturesRes.data)) {
                        facturesData = facturesRes.data;
                    } else if (facturesRes.data?.content && Array.isArray(facturesRes.data.content)) {
                        facturesData = facturesRes.data.content;
                    } else {
                        facturesData = [];
                    }
                } catch (err) {
                    console.warn('Erreur chargement factures:', err);
                    facturesData = [];
                }
                
                try {
                    const rapportRes = await factureService.getRapportJournalier();
                    rapportData = rapportRes.data || null;
                } catch (err) {
                    console.warn('Erreur chargement rapport:', err);
                    rapportData = null;
                }
                
                setFactures(facturesData);
                setRapport(rapportData);
            } catch (err) {
                console.error('Erreur:', err);
                setError('Erreur lors du chargement des factures');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="mt-4">
            <h2 className="mb-4">💰 Factures</h2>

            {rapport && (
                <Row className="mb-4">
                    <Col md={4}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Factures aujourd'hui</Card.Title>
                                <h3>{rapport.nombreFactures || 0}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Chiffre d'affaires</Card.Title>
                                <h3>{rapport.chiffreAffaires || 0} €</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Ticket moyen</Card.Title>
                                <h3>{rapport.ticketMoyen || 0} €</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <h4>Historique des factures</h4>
            {/* ✅ Vérifier que factures est un tableau avant d'appeler map */}
            {!factures || factures.length === 0 ? (
                <Alert variant="info">Aucune facture trouvée</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>N° Facture</th>
                            <th>N° Commande</th>
                            <th>Date</th>
                            <th>Montant</th>
                            <th>Mode de paiement</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(factures) && factures.map((facture) => (
                            <tr key={facture.idFacture}>
                                <td>{facture.idFacture}</td>
                                <td>{facture.commande?.idCommande || '-'}</td>
                                <td>{new Date(facture.datePaiement).toLocaleString()}</td>
                                <td><strong>{facture.montant} €</strong></td>
                                <td><Badge bg="success">{facture.modePaiement || 'Non payé'}</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default FacturesPage;