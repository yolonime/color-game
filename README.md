# Color Guesser

Jeu web avec 2 modes:
- Solo: partie de 5 manches (memoriser une couleur puis la reproduire).
- Online: partie de 5 manches en salon multijoueur temps reel avec classement cumule.
- Le mode online peut etre lance en Memoire, Nom couleur ou Mode code.

## Prerequis

Installer Node.js (version LTS recommandee, inclut npm).

## Lancer le projet

Depuis le dossier du projet:

```powershell
npm install
npm start
```

Puis ouvrir:

- http://localhost:3000

## Jouer en online

1. Ouvrir le menu burger puis choisir `Online`.
2. Entrer un pseudo.
3. Un joueur clique `Creer` (devient host).
4. Les autres entrent le code du salon puis `Rejoindre`.
5. Le host lance la partie (5 manches) depuis le menu burger.
6. Tout le monde reproduit la couleur puis valide.
7. Le classement s'affiche en fin de manche.

## Jouer en solo

1. Ouvrir le menu burger puis choisir `Solo`.
2. Cliquer `Nouvelle partie solo (5 manches)`.
3. A la fin de chaque manche, relancer la suivante depuis le menu burger.

## Hebergement

Le projet est pret pour un deploiement Docker. La base SQLite peut etre stockee dans un volume persistant via `DATA_DIR`.

### Construire localement

```powershell
docker build -t color-guesser .
docker run -p 3000:3000 -e DATA_DIR=/data -v color-guesser-data:/data color-guesser
```

### Points importants en production

1. Exposer le port `3000` ou injecter `PORT` via l'hebergeur.
2. Monter un volume sur `/data` pour conserver `data/color_game.db`.
3. Pointer le domaine vers le service Node, pas vers une simple page statique.

## Deploiement Render (debutant)

Le repo contient maintenant un fichier `render.yaml` qui configure:

- un service web Docker
- un disque persistant de 1 GB
- `DATA_DIR=/data` pour SQLite

### Etape 1 - Mettre le projet sur GitHub

1. Cree un repo GitHub.
2. Envoie le contenu du projet dans ce repo.

### Etape 2 - Creer ton compte Render

1. Va sur https://render.com
2. Clique `Get Started` puis connecte ton compte GitHub.

### Etape 3 - Deployer avec Blueprint

1. Dans Render, clique `New +` puis `Blueprint`.
2. Choisis le repo GitHub de ton projet.
3. Render detecte automatiquement `render.yaml`.
4. Clique `Apply` pour lancer le deploiement.

### Etape 4 - Tester

1. Attends la fin du build.
2. Ouvre l'URL fournie par Render.
3. Verifie le helper, le jeu solo, puis le mode online sur deux onglets.

### Notes utiles

- Le plan gratuit de Render peut endormir le service apres inactivite.
- Si le service dort, le premier chargement est plus lent.
- Les comptes restent gardes car la base SQLite est dans le disque persistant `/data`.
