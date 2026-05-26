import api from './api';

export const factureService = {
    getAll: () => api.get('/factures'),
    getById: (id) => api.get(`/factures/${id}`),
    create: (data) => api.post('/factures', data),
    getRapportJournalier: () => api.get('/factures/rapport/journalier'),
    getChiffreAffairesTotal: () => api.get('/factures/stats/ca-total'),
    getChiffreAffairesParPeriode: (debut, fin) => api.get(`/factures/stats/ca-periode?debut=${debut}&fin=${fin}`),
    getTicketMoyenParPeriode: (debut, fin) => api.get(`/factures/stats/ticket-moyen?debut=${debut}&fin=${fin}`),
    getStatistiquesMensuelles: () => api.get('/factures/stats/mensuelles'),
    getFacturesDuJour: () => api.get('/factures/jour'),
    getFacturesDeLaSemaine: () => api.get('/factures/semaine'),
    getFacturesDuMois: () => api.get('/factures/mois'),
};