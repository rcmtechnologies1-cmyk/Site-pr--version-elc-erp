import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface LoginPageProps {
  defaultEmail?: string;
}

// ============================================
// COMPOSANT SMART (Gère sa propre logique)
// Utilise AuthContext pour l'authentification
// ============================================

export function LoginPage({ defaultEmail = '' }: LoginPageProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer l'URL de redirection si elle existe (après login réussi)
  const from = (location.state as any)?.from || '/dashboard';

  // ============================================
  // EFFET: Redirection si déjà authentifié
  // IMPORTANT: Ne jamais appeler navigate() pendant le rendu !
  // ============================================
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ Utilisateur déjà authentifié, redirection vers:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialiser l'erreur
    setError('');
    setIsLoading(true);

    try {
      // Appel de la fonction login du contexte
      const result = await login(email, password);

      if (result.success) {
        // ✅ Connexion réussie, la redirection se fera via useEffect
        console.log('✅ Connexion réussie, redirection automatique...');
      } else {
        // ❌ Erreur d'authentification
        setError(result.error || 'Une erreur est survenue');
      }
    } catch (err) {
      // ❌ Erreur inattendue
      setError('Une erreur inattendue est survenue');
      console.error('Erreur login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#4F46E5] flex items-center justify-center">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-semibold text-[#111827]">ELC BTP</div>
              <div className="text-xs sm:text-sm text-[#6B7280]">Gestion</div>
            </div>
          </div>
        </div>

        {/* Titre */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-[#111827] mb-2 text-lg sm:text-xl">Bienvenue</h2>
          <p className="text-[#6B7280] text-sm sm:text-base">Connectez-vous pour gérer vos chantiers BTP</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-[#111827] mb-2 text-sm sm:text-base">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#4F46E5] transition-colors text-sm sm:text-base"
              placeholder="exemple@email.com"
              required
            />
          </div>

          {/* Champ Mot de passe */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-[#111827] text-sm sm:text-base">
                Mot de passe
              </label>
              <button
                type="button"
                className="text-xs sm:text-sm text-[#4F46E5] hover:text-[#4338CA] transition-colors"
              >
                Oublié ?
              </button>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#4F46E5] transition-colors text-sm sm:text-base"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Bouton de connexion avec spinner */}
          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{isLoading ? 'Connexion en cours...' : 'Se connecter'}</span>
          </button>

          {/* Indication des identifiants de test */}
          <div className="mt-6 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
            <p className="text-xs text-[#6B7280] text-center mb-2">
              <span className="font-medium text-[#111827]">Mode démo</span>
            </p>
            <p className="text-xs text-[#6B7280] text-center">
              Email: <span className="font-mono text-[#4F46E5]">comptable@elcbtp.com</span>
            </p>
            <p className="text-xs text-[#6B7280] text-center">
              Mot de passe: <span className="font-mono text-[#4F46E5]">elcbtp2026</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}