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
                const [facturesRes, rapportRes] = await Promise.all([
                    factureService.getAll(),
                    factureService.getRapportJournalier()
                ]);
                setFactures(facturesRes.data);
                setRapport(rapportRes.data);
            } catch {
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
                                <h3>{rapport.nombreFactures}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Chiffre d'affaires</Card.Title>
                                <h3>{rapport.chiffreAffaires} €</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Ticket moyen</Card.Title>
                                <h3>{rapport.ticketMoyen} €</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <h4>Historique des factures</h4>
            {factures.length === 0 ? (
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
                        {factures.map(facture => (
                            <tr key={facture.idFacture}>
                                <td>{facture.idFacture}</td>
                                <td>{facture.commande?.idCommande}</td>
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