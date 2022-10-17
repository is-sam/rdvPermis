# Script de recherche de places RdvPermis

## Prérequis
- Node.js & npm
- Un compte [RdvPermis](https://candidat.permisdeconduire.gouv.fr/)

## Installation
Aller dans le répertoire du projet et tapez la commande:
```
npm install
```

## Récupération du Cookie d'authentification:

1. Se connecter sur [RdvPermis](https://candidat.permisdeconduire.gouv.fr/).
2. Ouvrir l'Outil de développement du navigateur, onglet Réseaux, et filtrer les requêtes par XHR seulement.
3. Effectuer une recherche de créneaux par département.
4. Cliquer sur la requête qui apparaît.
5. Aller dans l'onglet Entête et scroller jusqu'à retrouver l'entête `Cookie`. Copier la valeur de ce Cookie.

## Utilisation du script
Avant de lancer le script, il faut au préalable avoir copié la valeur du Cookie d'authentification, le script va le charger du presse-papier.

Lancer le script avec la commande suivante:
```
node checkPlaces.mjs
```

### Restreindre les départements:
Le script prends en paramètre une suite de départements a vérifier, si ceux ci sont présents, le script ne vérifiera que les départements en question.

Utilisation:

```
node checkPlaces.mjs 75 92 93 94
```

## Restrictions de l'API
⚠️ Attention a ne pas exécuter le script en boucle au risque de vous faire blacklister car il y a une limite côté serveur. Si vous voyez le message `server throttling detected, retrying..` beaucoup de fois, réessayez plus tard.