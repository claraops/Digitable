import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
    langue: 'fr'
  });

  // Nettoyer les timeouts et toasts au démontage
  useEffect(() => {
    return () => {
      // Nettoyage
      toast.dismiss();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validation des champs avant envoi
  const validateForm = () => {
    if (!isLogin) {
      if (!formData.nom.trim()) {
        toast.error('Le nom est obligatoire');
        return false;
      }
      if (!formData.prenom.trim()) {
        toast.error('Le prénom est obligatoire');
        return false;
      }
      if (!formData.telephone.trim()) {
        toast.error('Le téléphone est obligatoire');
        return false;
      }
      const phoneRegex = /^(0[1-9](\d{2}){4}|\+33[1-9](\d{2}){4})$/;
      if (!phoneRegex.test(formData.telephone.replace(/\s/g, ''))) {
        toast.error('Numéro de téléphone invalide (ex: 0612345678)');
        return false;
      }
    }
    
    if (!formData.email.trim()) {
      toast.error('L\'email est obligatoire');
      return false;
    }
    
    if (!formData.password.trim()) {
      toast.error('Le mot de passe est obligatoire');
      return false;
    }
    
    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Éviter les soumissions multiples
    if (loading) return;
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    const toastId = toast.loading(isLogin ? 'Connexion en cours...' : 'Inscription en cours...');

    try {
      /*if (isLogin) {
        // Connexion
        const response = await api.post('/auth/login', {
          email: formData.email.trim(),
          password: formData.password
        });
        
        if (response.data) {
          // Stocker le token JWT (pas Basic Auth)
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
          
          // Stocker le Basic Auth pour la compatibilité
          const basicAuth = btoa(`${formData.email.trim()}:${formData.password}`);
          localStorage.setItem('basicAuth', basicAuth);
          
          // Stocker les infos utilisateur
          localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
          
          login(response.data);
          toast.success('Connexion réussie !', { id: toastId });
          
          // Redirection après un court délai
          setTimeout(() => navigate('/'), 500);
        }*/

      // Dans Auth.jsx - handleSubmit pour la connexion
      if (isLogin) {
          const response = await api.post('/auth/login', {
              email: formData.email.trim(),
              password: formData.password
          });
          
          if (response.data) {
              const token = response.data.token;
              const basicAuth = btoa(`${formData.email.trim()}:${formData.password}`);
              
              // ✅ Appel du login avec les deux méthodes
              login(response.data.user || response.data, token, basicAuth);
              
              toast.success('Connexion réussie !');
              navigate('/');
        }
      } else {
        // Inscription
        const payload = {
          nom: formData.nom.trim(),
          prenom: formData.prenom.trim(),
          email: formData.email.trim().toLowerCase(),
          telephone: formData.telephone.trim().replace(/\s/g, ''),
          langue: formData.langue,
          password: formData.password,
          role: 'CLIENT'
        };
        
        console.log('Envoi inscription:', payload);
        
        const response = await api.post('/auth/register', payload);
        
        if (response.data) {
          // Stocker le token JWT
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
          
          // Stocker le Basic Auth
          const basicAuth = btoa(`${formData.email.trim()}:${formData.password}`);
          localStorage.setItem('basicAuth', basicAuth);
          
          localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
          login(response.data);
          toast.success('Inscription réussie !', { id: toastId });
          
          setTimeout(() => navigate('/'), 500);
        }
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      
      // Affichage des erreurs détaillées du backend
      if (error.code === 'ERR_NETWORK' || !error.response) {
        toast.error('Serveur non accessible. Vérifiez que Spring Boot tourne sur http://localhost:8080', { id: toastId });
      } else if (error.response?.status === 401) {
        toast.error('Email ou mot de passe incorrect', { id: toastId });
      } else if (error.response?.status === 400) {
        const errorData = error.response.data;
        
        if (typeof errorData === 'object') {
          if (errorData.message) {
            toast.error(errorData.message, { id: toastId });
          } else if (errorData.errors) {
            const firstError = Object.values(errorData.errors)[0];
            toast.error(firstError || 'Données invalides', { id: toastId });
          } else if (errorData.fieldErrors) {
            const firstError = errorData.fieldErrors[0];
            toast.error(`${firstError.field}: ${firstError.message}`, { id: toastId });
          } else {
            toast.error('Données invalides. Vérifiez les champs.', { id: toastId });
          }
        } else {
          toast.error(errorData || 'Données invalides', { id: toastId });
        }
      } else if (error.response?.status === 409) {
        toast.error('Cet email est déjà utilisé', { id: toastId });
      } else {
        toast.error(isLogin ? 'Erreur de connexion' : 'Erreur lors de l\'inscription', { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center bg-gradient-to-br from-gray-light to-white-pure py-8 sm:py-12">
      <div className="container-responsive max-w-md w-full px-4">
        {/* Logo Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Menu<span className="text-gold">Pro</span>
          </h1>
          <p className="text-gray-dark text-sm sm:text-base">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white-pure rounded-2xl shadow-xl p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Registration Fields */}
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-dark mb-1.5 sm:mb-2">
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-dark w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                        className="input pl-9 sm:pl-10 text-sm"
                        placeholder="Jean"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-dark mb-1.5 sm:mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="input text-sm"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-dark mb-1.5 sm:mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-dark" size={16} />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                      className="input pl-9 sm:pl-10 text-sm"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <p className="text-xs text-gray-dark mt-1">Format: 0612345678 ou +33612345678</p>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-dark mb-1.5 sm:mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-dark" size={16} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input pl-9 sm:pl-10 text-sm"
                  placeholder="jean.dupont@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-dark mb-1.5 sm:mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-dark" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input pl-9 sm:pl-10 pr-10 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-dark hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-dark mt-1">Au moins 6 caractères</p>
            </div>

            {/* Language Selection */}
            {!isLogin && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-dark mb-1.5 sm:mb-2">
                  Langue
                </label>
                <select
                  name="langue"
                  value={formData.langue}
                  onChange={handleChange}
                  className="input text-sm"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            )}

            {/* Forgot Password Link */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs sm:text-sm text-gold hover:underline font-medium"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Se connecter' : "S'inscrire"}
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-5 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-dark">
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({
                    email: '',
                    password: '',
                    nom: '',
                    prenom: '',
                    telephone: '',
                    langue: 'fr'
                  });
                }}
                className="ml-2 text-gold font-semibold hover:underline transition-colors"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>

          {/* Social Login */}
          <div className="relative my-5 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-light"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white-pure text-gray-dark">Ou continuer avec</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 border border-gray-light rounded-lg hover:bg-gray-light transition-colors text-xs sm:text-sm font-medium"
            >
              <span className="text-lg">G</span>
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 border border-gray-light rounded-lg hover:bg-gray-light transition-colors text-xs sm:text-sm font-medium"
            >
              <span className="text-lg">f</span>
              <span>Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}