import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { MOCK_USERS } from '@/data/mockData';
import type { User } from '@/types';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ============================================
// CONSTANTES - CLÉS LOCALSTORAGE
// ============================================

// Clé localStorage pour la persistance de session
const AUTH_STORAGE_KEY = 'elc_btp_auth_session';
// Clé localStorage pour la liste des utilisateurs
const USERS_STORAGE_KEY = 'elc_btp_users';

// ============================================
// CRÉATION DU CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER - GESTION GLOBALE DE L'AUTHENTIFICATION
// ============================================

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ============================================
  // EFFET: Restauration de la session au chargement
  // ============================================
  useEffect(() => {
    const restoreSession = () => {
      try {
        const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);
        
        if (storedSession) {
          const session = JSON.parse(storedSession);
          
          // Vérifier que la session est valide et non expirée
          if (session.user && session.timestamp) {
            const now = Date.now();
            const sessionAge = now - session.timestamp;
            const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours en millisecondes
            
            if (sessionAge < maxAge) {
              // Session valide, restaurer l'utilisateur
              setUser(session.user);
              console.log('✅ Session restaurée:', session.user.name);
            } else {
              // Session expirée
              console.log('⚠️ Session expirée, nettoyage...');
              localStorage.removeItem(AUTH_STORAGE_KEY);
            }
          }
        }
      } catch (error) {
        console.error('❌ Erreur lors de la restauration de session:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ============================================
  // FONCTION: LOGIN (Authentification dynamique)
  // ============================================
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simuler un délai réseau (300ms)
    await new Promise(resolve => setTimeout(resolve, 300));

    // Récupérer la liste des utilisateurs (localStorage ou fallback sur MOCK_USERS)
    let users: User[] = MOCK_USERS;
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        users = JSON.parse(storedUsers);
      }
    } catch (error) {
      console.warn('⚠️ Erreur lecture localStorage, utilisation des MOCK_USERS');
    }

    // Chercher l'utilisateur par email ET mot de passe
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      // ✅ Connexion réussie
      const session = {
        user: foundUser,
        timestamp: Date.now()
      };

      // Sauvegarder la session dans localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      
      // Mettre à jour l'état
      setUser(foundUser);
      
      console.log('✅ Connexion réussie:', foundUser.name);
      
      return { success: true };
    } else {
      // ❌ Identifiants incorrects
      console.log('❌ Échec de connexion: Identifiants incorrects');
      
      return { 
        success: false, 
        error: 'Identifiants incorrects. Veuillez réessayer.' 
      };
    }

    // En production, on ferait:
    // try {
    //   const response = await api.post('/auth/login', { email, password });
    //   const { user, token } = response.data;
    //   
    //   localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token, timestamp: Date.now() }));
    //   setUser(user);
    //   
    //   return { success: true };
    // } catch (error) {
    //   return { success: false, error: error.message };
    // }
  };

  // ============================================
  // FONCTION: LOGOUT (Déconnexion)
  // ============================================
  const logout = () => {
    // Effacer le localStorage
    localStorage.removeItem(AUTH_STORAGE_KEY);
    
    // Réinitialiser l'état
    setUser(null);
    
    console.log('✅ Déconnexion réussie');
    
    // Rediriger vers la page de login
    navigate('/login', { replace: true });

    // En production, on ferait aussi:
    // await api.post('/auth/logout');
    // Invalider le token côté serveur
  };

  // ============================================
  // VALEUR DU CONTEXT
  // ============================================
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// HOOK PERSONNALISÉ: useAuth()
// Permet d'accéder facilement au contexte
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
}

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

export default AuthContext;