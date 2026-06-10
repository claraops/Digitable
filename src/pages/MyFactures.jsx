import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { factureService } from '../services/factureService';
import { FileText, Download, Eye, Euro, Calendar, CreditCard } from 'lucide-react';
import { useTranslation } from '../i18n/I18nContext';
import toast from 'react-hot-toast';
import Loader from '../components/Common/Loader';
import { Link } from 'react-router-dom';

export default function MyFactures() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacture, setSelectedFacture] = useState(null);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('invoices.title')}</h1>
          <p className="text-gray-500">{t('invoices.subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <Euro className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-gray-500 text-sm">{t('invoices.totalSpent')}</p>
            <p className="text-2xl font-bold text-gold">{factures.reduce((s, f) => s + (f.montant || 0), 0).toFixed(2)} €</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <FileText className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-gray-500 text-sm">{t('invoices.count')}</p>
            <p className="text-2xl font-bold">{factures.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <Calendar className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-gray-500 text-sm">{t('invoices.lastInvoice')}</p>
            <p className="text-lg font-semibold">{factures[0] ? formatDate(factures[0].datePaiement) : '-'}</p>
          </div>
        </div>

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
                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-lg">#{facture.idFacture}</p>
                      <p className="text-gray-500 text-sm">Commande #{facture.commande?.idCommande || '-'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-2xl font-bold text-gold">{facture.montant?.toFixed(2)} €</p>
                    <p className="text-sm text-gray-500">{formatDate(facture.datePaiement)}</p>
                    <p className="text-xs text-gray-400 mt-1">{facture.modePaiement || 'Carte bancaire'}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-3">
                  <button onClick={() => setSelectedFacture(facture)} className="text-gold text-sm flex items-center gap-1 hover:underline">
                    <Eye size={14} /> {t('invoices.details')}
                  </button>
                  <button className="text-gray-500 text-sm flex items-center gap-1 hover:text-gold">
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
              <p><strong>{t('invoices.associatedOrder')} :</strong> #{selectedFacture.commande?.idCommande}</p>
            </div>
            <div className="py-3">
              <h3 className="font-semibold mb-2">{t('invoices.articleDetails')}</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedFacture.commande?.platsCommandes?.map((plat, idx) => (
                  <div key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-1">
                    <span>{plat.platNom} x{plat.quantite}</span>
                    <span className="text-gold">{(plat.prixUnitaire * plat.quantite).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between font-bold">
              <span>{t('common.total')}</span>
              <span className="text-gold">{selectedFacture.montant?.toFixed(2)} €</span>
            </div>
            <button onClick={() => setSelectedFacture(null)} className="w-full bg-black-deep text-white py-2 rounded-xl font-semibold mt-6">{t('common.close')}</button>
          </div>
        </div>
      )}
    </div>
  );
}