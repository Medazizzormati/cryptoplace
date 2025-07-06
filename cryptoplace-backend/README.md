# Cryptoplace Backend API

Backend REST API pour la plateforme de trading de cryptomonnaies Cryptoplace, développé avec Spring Boot, PostgreSQL et JWT.

## 🚀 Fonctionnalités

- **Authentification JWT** avec refresh tokens
- **Sécurité robuste** avec Spring Security
- **Base de données PostgreSQL** avec JPA/Hibernate
- **API REST** complète avec documentation Swagger
- **Gestion des portfolios** crypto
- **Système d'alertes** de prix
- **Transactions** d'achat/vente
- **Intégration CoinGecko API**

## 📋 Prérequis

- Java 17 ou supérieur
- Maven 3.6+
- PostgreSQL 12+
- Redis (optionnel, pour le cache)

## ⚙️ Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd cryptoplace-backend
```

### 2. Configuration de la base de données PostgreSQL

#### Installation PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Windows - Télécharger depuis https://www.postgresql.org/download/windows/
# macOS
brew install postgresql
```

#### Création de la base de données
```sql
-- Se connecter à PostgreSQL
sudo -u postgres psql

-- Créer la base de données
CREATE DATABASE cryptoplace_db;

-- Créer l'utilisateur
CREATE USER cryptoplace_user WITH PASSWORD 'cryptoplace_password';

-- Accorder les privilèges
GRANT ALL PRIVILEGES ON DATABASE cryptoplace_db TO cryptoplace_user;

-- Quitter
\q
```

### 3. Configuration de l'application

Modifier le fichier `src/main/resources/application.properties` selon votre environnement :

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/cryptoplace_db
spring.datasource.username=cryptoplace_user
spring.datasource.password=cryptoplace_password

# JWT Configuration (CHANGEZ CES VALEURS EN PRODUCTION)
jwt.secret=VotreClefSecrete123456789012345678901234567890
jwt.expiration=86400000
jwt.refresh-expiration=604800000

# Mail Configuration (optionnel)
spring.mail.username=votre-email@gmail.com
spring.mail.password=votre-mot-de-passe-app
```

### 4. Installation des dépendances et compilation
```bash
mvn clean install
```

### 5. Lancement de l'application
```bash
mvn spring-boot:run
```

L'API sera disponible sur : `http://localhost:8080/api`

## 📚 Documentation API

### Swagger UI
Une fois l'application lancée, accédez à la documentation interactive :
- **Swagger UI** : `http://localhost:8080/api/swagger-ui.html`
- **API Docs** : `http://localhost:8080/api/api-docs`

### Endpoints principaux

#### Authentification
```
POST /api/auth/signin      - Connexion utilisateur
POST /api/auth/signup      - Inscription utilisateur
POST /api/auth/refresh     - Renouvellement du token
GET  /api/auth/me          - Informations utilisateur actuel
```

#### Utilisateurs
```
GET    /api/users/profile     - Profil utilisateur
PUT    /api/users/profile     - Modifier le profil
DELETE /api/users/account     - Supprimer le compte
```

#### Cryptomonnaies
```
GET /api/crypto/coins         - Liste des cryptomonnaies
GET /api/crypto/coin/{id}     - Détails d'une crypto
GET /api/crypto/prices        - Prix actuels
GET /api/crypto/history/{id}  - Historique des prix
```

#### Portfolio
```
GET    /api/portfolio         - Portfolio utilisateur
POST   /api/portfolio/add     - Ajouter une crypto
PUT    /api/portfolio/{id}    - Modifier une position
DELETE /api/portfolio/{id}    - Supprimer une position
```

#### Transactions
```
GET  /api/transactions        - Historique des transactions
POST /api/transactions/buy    - Acheter des cryptos
POST /api/transactions/sell   - Vendre des cryptos
```

#### Alertes
```
GET    /api/alerts            - Alertes utilisateur
POST   /api/alerts            - Créer une alerte
PUT    /api/alerts/{id}       - Modifier une alerte
DELETE /api/alerts/{id}       - Supprimer une alerte
```

## 🔐 Authentification

### Inscription
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Utilisation du token
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN"
```

## 🗄️ Structure de la base de données

### Tables principales
- **users** - Informations utilisateurs
- **portfolios** - Portfolios crypto des utilisateurs
- **transactions** - Historique des transactions
- **price_alerts** - Alertes de prix configurées

### Relations
- Un utilisateur peut avoir plusieurs portfolios
- Un portfolio contient plusieurs transactions
- Un utilisateur peut configurer plusieurs alertes

## 🔧 Configuration avancée

### Variables d'environnement
```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=cryptoplace_db
export DB_USER=cryptoplace_user
export DB_PASSWORD=cryptoplace_password
export JWT_SECRET=VotreClefSecrete
```

### Profils Spring
```bash
# Développement
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Production
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### Redis (Cache)
```bash
# Installation Redis
sudo apt install redis-server

# Configuration dans application.properties
spring.redis.host=localhost
spring.redis.port=6379
```

## 🐳 Docker (Optionnel)

### Dockerfile
```dockerfile
FROM openjdk:17-jre-slim
VOLUME /tmp
COPY target/cryptoplace-backend-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: cryptoplace_db
      POSTGRES_USER: cryptoplace_user
      POSTGRES_PASSWORD: cryptoplace_password
    ports:
      - "5432:5432"
  
  backend:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - postgres
```

## 🧪 Tests

```bash
# Tests unitaires
mvn test

# Tests d'intégration
mvn verify

# Coverage
mvn jacoco:report
```

## 📈 Monitoring

### Actuator endpoints
```
GET /api/actuator/health    - État de l'application
GET /api/actuator/metrics   - Métriques
GET /api/actuator/info      - Informations
```

## 🚀 Déploiement

### Build production
```bash
mvn clean package -Pprod
```

### Génération JAR
```bash
java -jar target/cryptoplace-backend-1.0.0.jar
```

## 🔒 Sécurité

- **JWT** avec expiration automatique
- **CORS** configuré pour le frontend
- **Validation** des données d'entrée
- **Chiffrement** des mots de passe avec BCrypt
- **Protection CSRF** activée

## 🐛 Dépannage

### Erreurs courantes

#### "Connection refused" (PostgreSQL)
```bash
sudo service postgresql start
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'newpassword';"
```

#### "Port 8080 already in use"
```bash
# Changer le port dans application.properties
server.port=8081
```

#### "JWT signature does not match"
```bash
# Vérifier la clé secrète JWT dans application.properties
jwt.secret=VotreClefSecrete
```

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@cryptoplace.com
- 🐛 Issues : [GitHub Issues](link-to-issues)
- 📖 Documentation : [Wiki](link-to-wiki)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 