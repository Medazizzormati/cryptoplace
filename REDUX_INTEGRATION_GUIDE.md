# 🚀 Redux Integration Guide - Cryptoplace

## 📋 Vue d'ensemble

L'application Cryptoplace a été entièrement intégrée avec **Redux Toolkit** et **RTK Query** pour une gestion d'état moderne et efficace. Cette intégration remplace les anciens Context API et offre une meilleure performance et une gestion d'état plus robuste.

## 🏗️ Architecture Redux

### Structure des dossiers
```
src/
├── store/
│   ├── index.js              # Store principal
│   ├── api/                  # API services avec RTK Query
│   │   ├── authApi.js        # Authentification
│   │   ├── cryptoApi.js      # Données crypto
│   │   ├── portfolioApi.js   # Portfolio
│   │   └── userApi.js        # Utilisateur
│   └── slices/               # State slices
│       ├── authSlice.js      # État authentification
│       ├── cryptoSlice.js    # État crypto
│       ├── portfolioSlice.js # État portfolio
│       └── userSlice.js      # État utilisateur
├── hooks/
│   └── useRedux.js          # Hooks personnalisés
└── components/
    ├── BuyModal.jsx         # Modal d'achat
    ├── AlertSystem.jsx      # Système d'alertes
    └── Modal.css            # Styles modaux
```

## 🔧 Configuration du Backend

### Prérequis
1. **Backend Spring Boot** doit être démarré sur `http://localhost:8080`
2. **Base de données PostgreSQL** configurée
3. **JWT Authentication** activé

### URLs API utilisées
- `/api/auth/*` - Authentification
- `/api/crypto/*` - Données crypto
- `/api/portfolio/*` - Operations portfolio
- `/api/users/*` - Gestion utilisateur

## 🎯 Fonctionnalités Principales

### 1. **Authentification Redux**
- **Login/Signup** avec JWT
- **Refresh tokens** automatique
- **Persistance** localStorage
- **Routes protégées** automatiques

### 2. **Gestion des Cryptomonnaies**
- **Récupération automatique** des données CoinGecko
- **Filtrage et recherche** en temps réel
- **Mise à jour automatique** des prix
- **Pagination** et tri

### 3. **Portfolio Management**
- **Achats/Ventes** de crypto
- **Suivi des transactions**
- **Calcul des performances**
- **Alertes** en temps réel

### 4. **Interface Utilisateur**
- **Modales** d'achat/vente
- **Système d'alertes** toast
- **Animations** fluides
- **Responsive design**

## 🚀 Démarrage Rapide

### 1. Installation
```bash
npm install @reduxjs/toolkit react-redux
```

### 2. Configuration
Le store Redux est déjà configuré dans `src/store/index.js` et intégré dans `src/main.jsx`.

### 3. Utilisation dans les composants
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { useGetCryptocurrenciesQuery } from '../store/api/cryptoApi';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { data: cryptos, isLoading } = useGetCryptocurrenciesQuery();
  
  // Utiliser les données...
};
```

## 📝 Hooks Personnalisés

### `useAuth()`
```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

### `useCrypto()`
```javascript
const { allCrypto, displayCrypto, currency } = useCrypto();
```

### `usePortfolio()`
```javascript
const { holdings, summary, buyCrypto, sellCrypto } = usePortfolio();
```

## 🔐 Sécurité

### JWT Management
- **Tokens** stockés dans localStorage
- **Refresh automatique** avant expiration
- **Déconnexion automatique** si non valide
- **Headers Authorization** automatiques

### Protection des Routes
```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## 📊 Performance

### Optimisations RTK Query
- **Cache automatique** des données
- **Invalidation intelligente**
- **Polling** optionnel
- **Optimistic updates**

### Réduction des re-renders
- **Sélecteurs optimisés**
- **Memoization** automatique
- **Lazy loading** des données

## 🎨 Composants Nouvellement Intégrés

### 1. **BuyModal**
Modal d'achat de cryptomonnaies avec:
- Formulaire de transaction
- Calcul automatique des coûts
- Validation des données
- Feedback utilisateur

### 2. **AlertSystem**
Système de notifications avec:
- Alertes toast animées
- Auto-dismiss après 5s
- Types: success, error, warning, info
- Positionnement responsive

### 3. **Redux DevTools**
Debugging avancé avec:
- State inspection
- Action replay
- Time travel debugging
- Performance monitoring

## 📱 Fonctionnalités Mobiles

### Responsive Design
- **Breakpoints** optimisés
- **Touch interactions**
- **Swipe gestures**
- **Modal adaptatives**

### Performance Mobile
- **Lazy loading**
- **Image optimization**
- **Reduced animations**
- **Efficient scrolling**

## 🔄 Migration depuis Context API

### Composants mis à jour
- ✅ **Home** - Utilise Redux pour les cryptos
- ✅ **LoginPage** - Authentification Redux
- ✅ **Dashboard** - Données portfolio Redux
- ✅ **Navbar** - État utilisateur Redux

### Anciens Context (maintenant dépréciés)
- ❌ `AuthContext` - Remplacé par `authSlice`
- ❌ `CoinContext` - Remplacé par `cryptoSlice`

## 🚦 États de l'Application

### Loading States
```javascript
const { isLoading, error, data } = useGetCryptocurrenciesQuery();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage />;
return <DataComponent data={data} />;
```

### Error Handling
```javascript
try {
  await buyCrypto(transactionData).unwrap();
  dispatch(addAlert({ type: 'success', message: 'Achat réussi!' }));
} catch (error) {
  dispatch(addAlert({ type: 'error', message: error.message }));
}
```

## 🎯 Prochaines Étapes

### Fonctionnalités à venir
1. **WebSocket** pour prix en temps réel
2. **Notifications push**
3. **Trading avancé**
4. **Analyse technique**
5. **Portfolio analytics**

### Améliorations techniques
1. **Service Worker** pour cache offline
2. **Progressive Web App**
3. **Micro-frontends**
4. **A/B testing**

## 🐛 Debugging

### Redux DevTools
1. Installer l'extension browser
2. Inspecter les actions et state
3. Utiliser time-travel debugging

### Network Monitoring
1. Onglet Network pour API calls
2. RTK Query cache inspection
3. Performance timeline

## 💡 Conseils d'Utilisation

### Best Practices
- Utiliser les hooks personnalisés
- Éviter les mutations directes
- Valider les données API
- Gérer les états de chargement

### Performance Tips
- Utiliser `skip` pour queries conditionnelles
- Implémenter la pagination
- Optimiser les selectors
- Limiter les re-renders

---

## 📞 Support

Pour toute question ou problème:
1. Vérifier les logs Redux DevTools
2. Consulter la documentation RTK Query
3. Tester les endpoints API directement
4. Vérifier la configuration du backend

**L'intégration Redux est maintenant complète et prête à l'utilisation !** 🎉 