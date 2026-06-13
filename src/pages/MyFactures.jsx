import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { factureService } from '../services/factureService';
import { commandeService } from '../services/commandeService';
import { FileText, Download, Eye, Euro, Calendar, CreditCard } from 'lucide-react';
import { useTranslation } from '../i18n/I18nContext';
import toast from 'react-hot-toast';
import Loader from '../components/Common/Loader';
import Button from '../components/Common/Button';
import { Link } from 'react-router-dom';

export default function MyFactures() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [commandeDetail, setCommandeDetail] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchFactures();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchFactures = async () => {
    try {
      const response = await factureService.getAll();
      let facturesData = [];
      if (Array.isArray(response.data)) {
        facturesData = response.data;
      } else if (response.data?.content) {
        facturesData = response.data.content;
      }
      setFactures(facturesData);
    } catch (error) {
      console.error('Erreur factures:', error);
      toast.error('Erreur chargement factures');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('errors.notAuthenticated')}</h2>
          <Link to="/login" className="bg-black-deep text-white px-6 py-2 rounded-lg">{t('nav.login')}</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" /></div>;

  const totalAmount = factures.reduce((sum, f) => sum + (Number(f.montant || 0)), 0);
  const latestInvoice = factures[0] ? formatDate(factures[0].datePaiement) : '-';

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="rounded-[2rem] bg-gradient-to-br from-gold/10 via-white to-gray-50 border border-black-deep/10 p-8 shadow-[0_24px_80px_rgba(15,15,15,0.08)] mb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-3xl bg-white shadow-sm mb-4">
                <FileText className="w-7 h-7 text-gray-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('invoices.title')}</h1>
              <p className="text-gray-500 max-w-2xl">{t('invoices.subtitle')}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-5 border border-gray-100 shadow-sm text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">{t('invoices.totalSpent')}</p>
                <p className="mt-3 text-3xl font-bold text-black-deep">{totalAmount.toFixed(2)} €</p>
              </div>
              <div className="rounded-3xl bg-white p-5 border border-gray-100 shadow-sm text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">{t('invoices.count')}</p>
                <p className="mt-3 text-3xl font-bold text-black-deep">{factures.length}</p>
              </div>
              <div className="rounded-3xl bg-white p-5 border border-gray-100 shadow-sm text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">{t('invoices.lastInvoice')}</p>
                <p className="mt-3 text-2xl font-semibold text-black-deep">{latestInvoice}</p>
              </div>
            </div>
          </div>
        </div>

        {factures.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <FileText className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">{t('invoices.noInvoices')}</h3>
            <p className="text-gray-500 mb-6">{t('invoices.noInvoicesDesc')}</p>
            <Button variant="primary" size="md" onClick={() => window.location.href = '/menu'}>{t('cart.discoverMenu')}</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {factures.map((facture) => (
              <div key={facture.idFacture} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-3xl bg-gray-100 p-4 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-lg">#{facture.idFacture}</p>
                      <p className="text-gray-500 text-sm">Commande #{facture.commande?.idCommande || '-'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-black-deep">{facture.montant?.toFixed(2)} €</p>
                    <p className="text-sm text-gray-500">{formatDate(facture.datePaiement)}</p>
                    <p className="text-xs text-gray-400 mt-1">{facture.modePaiement || 'Carte bancaire'}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3 justify-end">
                  <Button variant="secondary" size="md" onClick={async () => {
                    setSelectedFacture(facture);
                    setCommandeDetail(null);
                    if (facture.commande?.idCommande) {
                      try {
                        const res = await commandeService.getById(facture.commande.idCommande);
                        setCommandeDetail(res.data);
                      } catch (e) { console.warn('Impossible de charger la commande', e); }
                    }
                  }}>
                    <Eye size={16} /> {t('invoices.details')}
                  </Button>
                  <Button variant="outline" size="md">
                    <Download size={16} /> {t('invoices.pdf')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {factures.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('invoices.noInvoices')}</h3>
            <p className="text-gray-500 mb-4">{t('invoices.noInvoicesDesc')}</p>
            <Link to="/menu" className="bg-black-deep text-white px-6 py-2 rounded-lg inline-block">{t('cart.discoverMenu')}</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {factures.map((facture) => (
              <div key={facture.idFacture} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-lg">#{facture.idFacture}</p>
                      <p className="text-gray-500 text-sm">Commande #{facture.commande?.idCommande || '-'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-2xl font-bold text-black-deep">{facture.montant?.toFixed(2)} €</p>
                    <p className="text-sm text-gray-500">{formatDate(facture.datePaiement)}</p>
                    <p className="text-xs text-gray-400 mt-1">{facture.modePaiement || 'Carte bancaire'}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-3">
                  <button onClick={async () => {
                    setSelectedFacture(facture);
                    setCommandeDetail(null);
                    if (facture.commande?.idCommande) {
                      try {
                        const res = await commandeService.getById(facture.commande.idCommande);
                        setCommandeDetail(res.data);
                      } catch (e) { console.warn('Impossible de charger la commande', e); }
                    }
                  }} className="text-gray-700 text-sm flex items-center gap-1 hover:underline">
                    <Eye size={14} /> {t('invoices.details')}
                  </button>
                  <button className="text-gray-500 text-sm flex items-center gap-1 hover:text-gray-700">
                    <Download size={14} /> {t('invoices.pdf')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Détails Facture */}
      {selectedFacture && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('invoices.invoiceNumber')} #{selectedFacture.idFacture}</h2>
              <button onClick={() => setSelectedFacture(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3 border-b border-gray-100 pb-3">
              <p><strong>{t('common.date')} :</strong> {formatDate(selectedFacture.datePaiement)}</p>
              <p><strong>{t('invoices.paymentMode')} :</strong> {selectedFacture.modePaiement || 'Carte bancaire'}</p>
              <p><strong>{t('invoices.associatedOrder')} :</strong>
                <Link to={`/tracking/${selectedFacture.commande?.idCommande}`} className="text-gray-800 hover:underline ml-1">
                  #{selectedFacture.commande?.idCommande}
                </Link>
              </p>
              {commandeDetail && (
                <>
                  <p><strong>{t('orders.table')} :</strong> {commandeDetail.numeroTable}</p>
                  <p><strong>{t('common.status')} :</strong> {commandeDetail.statut}</p>
                </>
              )}
            </div>
            <div className="py-3">
              <h3 className="font-semibold mb-2">{t('invoices.articleDetails')}</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(commandeDetail?.platsCommandes || selectedFacture.commande?.platsCommandes || []).map((plat, idx) => (
                  <div key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-1">
                    <span>{plat.platNom} x{plat.quantite}</span>
                    <span className="text-black-deep">{(plat.prixUnitaire * plat.quantite).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between font-bold">
              <span>{t('common.total')}</span>
              <span className="text-black-deep">{selectedFacture.montant?.toFixed(2)} €</span>
            </div>
            <button onClick={() => setSelectedFacture(null)} className="w-full bg-black-deep text-white py-2 rounded-xl font-semibold mt-6">{t('common.close')}</button>
          </div>
        </div>
      )}
    </div>
  );
}