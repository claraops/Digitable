import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, Clock, AlertCircle, Sparkles, Calendar, Clock as ClockIcon } from 'lucide-react';
import { tablesService } from '../services/tablesService';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Loader from '../components/Common/Loader';
import tableImage from '../assets/table.avif';
import tableIcon from '../assets/tableicn.png';

export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [reservationName, setReservationName] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  // Dans Tables.jsx, modifiez la fonction fetchTables
const fetchTables = async () => {
  try {
    setLoading(true);
    const response = await tablesService.getAll();
    
    let tablesData = [];
    if (Array.isArray(response.data)) {
      tablesData = response.data;
    } else if (response.data?.content) {
      tablesData = response.data.content;
    }
    
    // ✅ Normaliser les IDs (l'entité Java utilise idTables)
    const normalizedTables = tablesData.map(table => ({
      ...table,
      idTable: table.idTables || table.idTable,
      idTables: table.idTables
    }));
    
    setTables(normalizedTables);
  } catch (error) {
    console.error('Erreur chargement tables:', error);
    toast.error('Erreur lors du chargement des tables');
    setTables([]);
  } finally {
    setLoading(false);
  }
};

  const handleSelectTable = (table) => {
    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour sélectionner une table');
      navigate('/login');
      return;
    }
    
    if (table.statut === 'LIBRE') {
      setSelectedTable(table);
      setReservationName(user?.prenom + ' ' + user?.nom || 'Client');
      setShowReservationModal(true);
    } else if (table.statut === 'OCCUPEE') {
      toast.error('Cette table est actuellement occupée');
    } else if (table.statut === 'RESERVEE') {
      toast.error('Cette table est réservée');
    } else if (table.statut === 'A_NETTOYER') {
      toast.error('Cette table est en cours de nettoyage');
    }
  };

  /*const handleReserveAndOrder = () => {
    if (!selectedTable) return;
    
    const reservationInfo = {
      ...selectedTable,
      reservationDate: reservationDate || new Date().toISOString().split('T')[0],
      reservationTime: reservationTime || 'maintenant',
      reservationName: reservationName,
      reservationTimestamp: new Date().toISOString()
    };*/

  const handleReserveAndOrder = () => {
    if (!selectedTable) return;
  
  // Assurez-vous que selectedTable a un champ idTable
  console.log('Table sélectionnée à sauvegarder:', selectedTable);
  
  const reservationInfo = {
    ...selectedTable,
    idTable: selectedTable.idTable || selectedTable.ID_TABLES || selectedTable.id,
    reservationDate: reservationDate || new Date().toISOString().split('T')[0],
    reservationTime: reservationTime || 'maintenant',
    reservationName: reservationName
  };
    localStorage.setItem('selectedTable', JSON.stringify(reservationInfo));
    localStorage.setItem('reservationInfo', JSON.stringify(reservationInfo));
    
    toast.success(`Table ${selectedTable.numeroTable} réservée pour ${reservationName}`);
    navigate('/menu');
  };

  const getStatusBadge = (statut) => {
    const config = {
      'LIBRE': { label: 'Disponible', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200' },
      'OCCUPEE': { label: 'Occupée', icon: AlertCircle, color: 'bg-red-100 text-red-700 border-red-200' },
      'RESERVEE': { label: 'Réservée', icon: Clock, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      'A_NETTOYER': { label: 'Nettoyage', icon: Sparkles, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
    };
    const { label, icon: Icon, color } = config[statut] || config.LIBRE;
    return { label, Icon, color };
  };

  if (loading) return <Loader fullScreen />;

  const availableTables = tables.filter(t => t.statut === 'LIBRE').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img 
          src={tableImage} 
          alt="Tables du restaurant" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-4 backdrop-blur-sm">
            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M6 14h12m-7-4V4m4 6V4M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Choisissez votre table</h1>
          <p className="text-white/80 max-w-md">
            Sélectionnez une table disponible pour commencer votre commande
          </p>
          {!isAuthenticated() && (
            <div className="mt-4 inline-flex items-center gap-2 bg-gold text-black-deep px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              <AlertCircle size={16} />
              Veuillez vous connecter pour sélectionner une table
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-8 relative z-30">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gold">{tables.length}</p>
            <p className="text-gray-500 text-xs">Tables totales</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-green-600">{availableTables}</p>
            <p className="text-gray-500 text-xs">Disponibles</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-red-600">{tables.filter(t => t.statut === 'OCCUPEE').length}</p>
            <p className="text-gray-500 text-xs">Occupées</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-blue-600">{tables.filter(t => t.statut === 'RESERVEE').length}</p>
            <p className="text-gray-500 text-xs">Réservées</p>
          </div>
        </div>

        {/* Tables Grid - Version avec icône circulaire */}
        {tables.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M6 14h12m-7-4V4m4 6V4M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">Aucune table disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tables.map((table) => {
              const { label, Icon, color } = getStatusBadge(table.statut);
              const isAvailable = table.statut === 'LIBRE';
              
              return (
                <div
                  key={table.idTable}
                  onClick={() => handleSelectTable(table)}
                  className={`
                    relative bg-white rounded-xl p-5 transition-all duration-300 cursor-pointer
                    ${isAvailable 
                      ? 'hover:shadow-lg hover:-translate-y-1 border border-gray-100 hover:border-gold/30' 
                      : 'opacity-60 cursor-not-allowed'}
                    shadow-sm
                  `}
                >
                  {isAvailable && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-gold text-black-deep text-xs px-2 py-1 rounded-full shadow-md">
                        Disponible
                      </div>
                    </div>
                  )}
                  
                  {/* Icône circulaire en haut */}
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center shadow-inner border-2 border-gold/30">
                      <img 
                        src={tableIcon} 
                        alt="Table" 
                        className="w-12 h-12 object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      {!tableIcon && (
                        <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M6 14h12m-7-4V4m4 6V4M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  {/* Informations table */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-1">Table {table.numeroTable}</h3>
                    
                    <div className="flex items-center justify-center gap-3 text-gray-500 text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{table.capacite} pers.</span>
                      </div>
                      {table.localisation && (
                        <div className="flex items-center gap-1">
                          <span>📍</span>
                          <span className="text-xs">{table.localisation}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Badge statut */}
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                      <Icon size={12} />
                      {label}
                    </span>
                    
                    {isAvailable && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <span className="text-gold text-xs font-medium flex items-center justify-center gap-1">
                          Sélectionner →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de réservation (inchangé) */}
        {showReservationModal && selectedTable && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md transform transition-all">
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <img src={tableIcon} alt="Table" className="w-7 h-7 object-contain" />
                </div>
                <h2 className="text-xl font-bold">Table {selectedTable.numeroTable}</h2>
                <p className="text-gray-500 text-sm">Capacité: {selectedTable.capacite} personnes</p>
              </div>
              
              <div className="space-y-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom pour la réservation</label>
                  <input
                    type="text"
                    value={reservationName}
                    onChange={(e) => setReservationName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      value={reservationDate}
                      onChange={(e) => setReservationDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                  <div className="relative">
                    <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="time"
                      value={reservationTime}
                      onChange={(e) => setReservationTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 text-center mb-4">
                Les informations de réservation seront sauvegardées
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleReserveAndOrder}
                  className="flex-1 bg-black-deep hover:bg-gray-800 text-white py-2.5 rounded-xl font-semibold transition-all"
                >
                  Commander maintenant
                </button>
                <button
                  onClick={() => {
                    setShowReservationModal(false);
                    setSelectedTable(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}