# Itérations — Méditerranée 2000 (squad Corazòn, 9J5WC4)

- **Source du plan** : proposé par l'agent. Aucun plan d'itérations de l'équipe trouvé dans `passation/cadrage/` (pas de fichier `*iteration*`) ni dans `passation.json` (pas de clé `iterations`).
- **Temps annoncé** : 10 minutes de codage, **une seule itération possible** (indiqué par le développeur). Plan validé le 2026-11-04 (réponse « go » du développeur).
- **Durée du tour de test** : non précisée par le développeur ⚠️ — par défaut 10 minutes (règle de `CLAUDE.md`), sans incidence ici puisqu'aucune itération suivante n'est planifiée.
- **Hors périmètre (✂️, imposé par le temps, pas par choix produit)** :
  - Le modèle de données imposé (19 entités, UUID v7, chargement des 19 CSV) — ne tient à aucun titre dans 10 minutes. Aucune des règles métier (droits, cloisonnement, historique) n'est donc appliquée.
  - Les 3 autres écrans du plan de livraison de l'équipe : Reporter une séance, Validation — Coordinatrice, Mail de rappel.
  - L'écran « Qui êtes-vous ? » (sélection de rôle) : remplacé par un nom/rôle fixe affiché en en-tête, sans sélecteur.
  - Toute automatisation réelle (Outlook, Excel, envoi de message, rappels J-7/J-2/J-1).
  - Persistance réelle : les données restent en dur dans le code, aucune base.

Cette itération est donc la variante « squelette » de la section 3 de `CLAUDE.md` : poser le contrat de déployabilité et montrer l'écran principal du cas passant avec des données en dur, pour avoir quelque chose de démontrable et en ligne au pitch.

## Itération 1 : afficher le tableau de bord des séances, en ligne, avec des données en dur

- **Dans le périmètre** :
  - `frontend/` : remplacer la page d'accueil Next.js par défaut par l'écran « Tableau de bord » : un en-tête fixe (« Claire Lefèvre · Coordinatrice de projet »), une liste de séances codée en dur (projet, école, enseignant, date, statut parmi à confirmer / réalisé / reporté), avec les demandes de report en attente visuellement distinguées.
  - `.env.example` et `DEPLOIEMENT.md` à la racine (exigés par la DoD, absents aujourd'hui).
  - `./scripts/verifier-deployabilite.sh` passe sans alarme.
- **Hors périmètre** : filtres (projet/école/enseignant/date), toute action (valider, reporter), tout appel à l'API, toute base de données.
- **Critères d'acceptation** :
  - Étant donné l'URL publique de l'application, quand on l'ouvre, alors l'écran affiche une liste d'au moins 3 séances avec projet, école, enseignant, date et statut.
  - Étant donné une séance avec une demande de report en attente dans les données en dur, quand on consulte la liste, alors elle est visuellement signalée comme différente d'une séance confirmée ou réalisée.
  - Étant donné `$URL_PUBLIQUE/health` et `$URL_PUBLIQUE/sante`, quand le développeur les ouvre dans son navigateur, alors les deux répondent 200 avec un corps qui n'est pas la page de réveil.
- **Hypothèse de l'équipe couverte** : aucune directement mesurable (données en dur) — prépare celle sur la réduction du délai de répercussion, que l'itération suivante (non planifiée ici) rendrait mesurable.
- **Codage estimé** : 10 minutes (plafond du budget annoncé).
- **Fichiers prévus** :
  - `frontend/src/app/page.tsx`
  - `frontend/src/data/seances.ts` (données en dur)
  - `frontend/src/app/page.module.css`
  - `.env.example`
  - `DEPLOIEMENT.md`
- **Tests unitaires prévus** : 1, sur la fonction qui distingue une séance « demande de report en attente » (logique de classement, pas du balisage).
- **Étapes ajoutées à la démo** (`e2e/demo.spec.ts`, si le temps le permet après la publication) : ouvrir l'application, vérifier que le tableau de bord affiche au moins une séance.
- **Bilan** :
  - Durée de codage réelle : 1 minute (budget 10 min, pas de dépassement).
  - Critères d'acceptation : les 3 satisfaits (tableau de bord avec 5 séances en dur ; 2 demandes de report visuellement signalées par un tag ⚠ ; `/health` et `/sante` répondent 200 sur le front et l'api, corps vérifié — pas la page de réveil).
  - Contrat de déployabilité : `./scripts/verifier-deployabilite.sh` — aucune borne.
  - Déployé selon `/CLAUDE.md` du serveur : plateforme démarrée, base `team04` créée (non utilisée par le code pour l'instant), images construites avec base `docker.io/library/...`, poussées, `podman-compose.yml` lancé. Vérifié en local : `localhost:8080/`, `/health`, `/sante` et `localhost:8081/health`, `/sante` répondent 200 avec le bon corps.
  - Signalé à PM Lab : version 1, `./scripts/signaler-version.sh 1` — acceptée (`moteur_avance: false`).
  - Démo (`e2e/demo.spec.ts`) : étape ajoutée (vérifie le titre du tableau de bord et une demande de report visible), mais **n'a pas pu s'exécuter sur cette machine** : Chromium Playwright installé, mais il manque des bibliothèques système (`libnspr4.so` et consorts) que je n'ai pas installées (nécessiterait des droits root sur une machine partagée). Non bloquant pour la DoD — à signaler à l'équipe plateforme si la démo doit tourner ici.
  - Reporté : tout le reste de « À venir » ci-dessous, en particulier le modèle de données imposé (préalable obligatoire à tout écran réel selon la passation).
  - **Modifications** :
    - `frontend/src/data/seances.ts` (nouveau) : 5 séances en dur + `seancesAvecReportEnAttente` — logique de classement, testée.
    - `frontend/src/data/seances.test.ts` (nouveau) : 2 tests unitaires sur `seancesAvecReportEnAttente`.
    - `frontend/src/app/page.tsx` : remplace la page Next.js par défaut par l'écran Tableau de bord — critère 1 et 2.
    - `frontend/src/app/page.module.css` : styles du tableau de bord (palette reprise du prototype).
    - `frontend/src/app/layout.tsx` : titre/langue de la page (`fr`, « MédiPlan »), repéré pendant la vérification visuelle, hors des 5 fichiers prévus mais trivial.
    - `.env.example`, `DEPLOIEMENT.md` (nouveaux) : contrat de déployabilité.
    - `api/Dockerfile`, `frontend/Dockerfile` : images de base qualifiées `docker.io/library/...` (exigence du serveur).
    - `podman-compose.yml` (nouveau) : déploiement selon la recette du serveur, ports 8080/8081.
    - `e2e/demo.spec.ts` : étape de démo ajoutée (non exécutée ici, cf. ci-dessus).

## À venir (hors budget de cette session)

1. Charger le modèle de données imposé (19 entités depuis `donnees/modele_donnees.json`) et le jeu de test CSV — préalable obligatoire avant tout écran réel.
2. Écran « Qui êtes-vous ? » et droits (admin / coordinatrice / animatrice).
3. Écran Reporter une séance (formulaire animatrice).
4. Écran Validation — Coordinatrice (une validation déclenche agenda + fichier + historique + message).
5. Écran Mail de rappel (J-7/J-2/J-1, bouton reprogrammation).
