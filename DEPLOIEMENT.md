# Guide de déploiement - Release Quest

## Préparation pour la production

### 1. Configuration de l'environnement

Avant de déployer, assurez-vous de configurer les variables d'environnement :

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env avec vos valeurs
nano .env
```

Variables importantes :
- `VITE_N8N_WEBHOOK_URL` : URL du webhook n8n pour recevoir les données des joueurs
- `VITE_DEV_MODE` : Mettre à `false` en production
- `VITE_DEBUG_LOGS` : Mettre à `false` en production

### 2. Build de production

```bash
# Installer les dépendances
npm install

# Créer le build de production
npm run build
```

Le dossier `dist/` contiendra tous les fichiers optimisés pour la production.

### 3. Test du build

Avant de déployer, testez le build localement :

```bash
npm run preview
```

Ouvrez votre navigateur à l'adresse indiquée (généralement http://localhost:4173) et testez le jeu.

### 4. Déploiement

#### Option A : Netlify

1. Créer un compte sur [Netlify](https://www.netlify.com)
2. Connecter votre dépôt GitHub
3. Configurer le build :
   - Build command : `npm run build`
   - Publish directory : `dist`
4. Ajouter les variables d'environnement dans les paramètres Netlify
5. Déployer

#### Option B : Vercel

1. Créer un compte sur [Vercel](https://vercel.com)
2. Importer votre projet depuis GitHub
3. Vercel détectera automatiquement Vite
4. Ajouter les variables d'environnement
5. Déployer

#### Option C : GitHub Pages

```bash
# Installer gh-pages
npm install --save-dev gh-pages

# Ajouter dans package.json :
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

# Déployer
npm run deploy
```

#### Option D : Serveur personnalisé

Uploadez le contenu du dossier `dist/` sur votre serveur web (Apache, Nginx, etc.).

Configuration Nginx exemple :

```nginx
server {
    listen 80;
    server_name votredomaine.com;
    root /var/www/release-quest/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache des assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5. Vérifications post-déploiement

Après le déploiement, vérifiez :

- ✅ Le jeu se charge correctement
- ✅ Le BootScene s'affiche avec le titre
- ✅ La transition vers MenuScene fonctionne
- ✅ Le formulaire de démarrage fonctionne
- ✅ Les données sont envoyées au webhook n8n
- ✅ Le World1 se lance correctement
- ✅ Les contrôles répondent
- ✅ Le HUD s'affiche
- ✅ Les collisions fonctionnent

### 6. Optimisations recommandées

#### Compression

Activez la compression gzip/brotli sur votre serveur :

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

#### CDN

Utilisez un CDN pour servir les assets statiques plus rapidement.

#### Monitoring

Ajoutez un outil de monitoring comme :
- Google Analytics
- Sentry pour les erreurs
- Hotjar pour le comportement utilisateur

### 7. Maintenance

#### Mise à jour

```bash
# Récupérer les dernières modifications
git pull origin main

# Installer les nouvelles dépendances
npm install

# Rebuild
npm run build

# Redéployer
```

#### Logs

Surveillez les logs du webhook n8n pour voir les données des joueurs.

### 8. Problèmes courants

#### Le jeu ne se charge pas

- Vérifiez la console du navigateur (F12)
- Vérifiez que tous les fichiers sont présents dans `dist/`
- Vérifiez la configuration du serveur web

#### Les données ne sont pas envoyées

- Vérifiez l'URL du webhook dans `.env`
- Vérifiez que le webhook n8n est actif
- Vérifiez les CORS si nécessaire

#### Écran noir

- Vérifiez que les corrections de couleur sont appliquées
- Vérifiez la console pour les erreurs JavaScript
- Testez avec `npm run dev` en local

### 9. Support

Pour toute question ou problème :
- Consultez les logs de la console (F12)
- Vérifiez le fichier `ANALYSE_PROBLEMES.md`
- Consultez le README.md pour les fonctionnalités

### 10. Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Build de production créé
- [ ] Build testé localement
- [ ] Webhook n8n configuré et testé
- [ ] Domaine configuré (si applicable)
- [ ] SSL/HTTPS activé
- [ ] Compression activée
- [ ] Cache configuré
- [ ] Monitoring en place
- [ ] Tests post-déploiement effectués

Votre jeu est maintenant prêt pour la production ! 🚀🎮
