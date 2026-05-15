import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { utilisateurService } from '../services/utilisateurService';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await utilisateurService.getByEmail(formData.email);
        if (response.data && response.data.password === formData.password) {
          login(response.data);
          toast.success('Connexion réussie !');
          navigate('/');
        } else {
          toast.error('Email ou mot de passe incorrect');
        }
      } else {
        const newUser = {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          langue: formData.langue,
          password: formData.password,
          role: 'CLIENT'
        };
        const response = await utilisateurService.create(newUser);
        login(response.data);
        toast.success('Inscription réussie !');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && (!error.response || error.code === 'ERR_NETWORK')) {
        toast.error('Serveur non accessible. Vérifiez que Spring Boot tourne sur http://localhost:8080');
      } else if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error('Utilisateur non trouvé. Vérifiez votre email.');
      } else {
        toast.error(isLogin ? 'Email ou mot de passe incorrect' : 'Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex items-center justify-center bg-gradient-to-br from-gray-light to-white-pure py-8 sm:py-12 safe-area-top safe-area-bottom">
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
                {/* Names Row */}
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

                {/* Phone */}
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
                      className="input pl-9 sm:pl-10 text-sm"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
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
                  aria-label="Afficher le mot de passe"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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
                <a href="/forgot-password" className="text-xs sm:text-sm text-gold hover:underline font-medium">
                  Mot de passe oublié ?
                </a>
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
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-gold font-semibold hover:underline transition-colors"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-5 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-light"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white-pure text-gray-dark">Ou continuer avec</span>
            </div>
          </div>

          {/* Social Login */}
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