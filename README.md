# 🏦 MyBank

## Lancer l'application

### 1. Cloner le dépôt

```bash
git clone https://github.com/Zino-99/MyBank.git
cd MyBank
```

### 2. Démarrer les conteneurs

```bash
docker compose up --build
```

### 3. Appliquer les migrations

```bash
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction
```

### 4. Charger les fixtures

```bash
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction
```

### 5. Accéder à l'application

| Service | URL |
|---|---|
| Application | http://localhost:3000 |
| API | http://localhost:8000 |
| phpMyAdmin | http://localhost:8080 |

## Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Utilisateur | `user@exemple.com` | `user123` |

