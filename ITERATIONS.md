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

## Itération 2 (ad hoc) : front cliquable des 4 écrans, données en mémoire

- **Origine** : demande du développeur en cours de hackathon, hors plan initial : « faire la version complète avec tous les écrans, tout le flow, le design, pour tester » — 10 minutes annoncées, tour de test immédiat de l'équipe.
- ⚠️ Avertissement donné avant de coder : 4 écrans + vraie base de données + vrai flow (mail réel, Outlook, Excel) ne tenaient pas dans 10 minutes. Compromis proposé et exécuté : un **front cliquable, données en mémoire côté client** (comme le prototype HTML), sans API ni persistance réelle.
- **Dans le périmètre** :
  - `frontend/src/app/page.tsx` : page convertie en composant client avec état de navigation entre 4 écrans (`dashboard`, `reporter`, `validation`, `mail`), état des séances en mémoire (`useState`).
  - Écran **Reporter une séance** : formulaire (date, motif, précisions) repris du prototype, pour une séance choisie depuis le tableau de bord.
  - Écran **Validation — Coordinatrice** : diff ancienne/nouvelle date, motif, liste des synchronisations automatiques (affichées, non réelles), boutons Valider / Refuser.
  - Écran **Mail de rappel** : aperçu statique du mail avec bouton « Demander une reprogrammation » qui renvoie vers Reporter une séance.
  - `frontend/src/data/seances.ts` : nouvelle fonction `traiterDemandeDeReport` (logique métier : valider lève la demande, change le statut en « reportée » et applique la nouvelle date ; refuser lève la demande sans toucher au statut/à la date).
  - `frontend/src/app/page.module.css` : styles ajoutés pour les 3 nouveaux écrans (formulaire, bandeau de diff, lignes de notification, aperçu de mail, boutons), palette identique à l'itération 1.
- **Hors périmètre (explicite, redit)** : le modèle de données imposé (19 entités), toute API/BDD réelle, l'écran « Qui êtes-vous ? », l'envoi de mail réel, la synchronisation Outlook/Excel réelle, l'historique réel. Rien n'est persistant : un rechargement de page réinitialise l'état.
- **Critères d'acceptation** :
  - Étant donné le tableau de bord, quand on clique sur « Voir → » d'une séance en attente de report, alors l'écran de validation s'affiche avec l'ancienne et la nouvelle date.
  - Étant donné l'écran de validation, quand on clique sur « Valider le report » ou « Refuser », alors on revient au tableau de bord et la demande n'est plus signalée en attente.
  - Étant donné le tableau de bord, quand on ouvre l'aperçu du mail de rappel, alors le bouton « Demander une reprogrammation » ouvre le formulaire de report.
- **Codage estimé** : 10 minutes (budget annoncé par le développeur).
- **Bilan** :
  - Durée de codage réelle : 4 minutes (pas de dépassement, pas d'alarme à 8 minutes).
  - Critères d'acceptation : les 3 satisfaits, vérifiés par lecture du HTML servi (titres des écrans présents) ; parcours non testé au clic dans un vrai navigateur par l'agent (pas d'accès visuel), à valider par le développeur.
  - Tests unitaires : 2 ajoutés sur `traiterDemandeDeReport` (validation et refus), en plus des 2 existants — `npm test` : 4 tests passent.
  - Contrat de déployabilité : `./scripts/verifier-deployabilite.sh` — aucune borne.
  - Déployé : image `frontend` reconstruite (base `docker.io/library/...` déjà qualifiée), poussée, service recréé. Vérifié en local : `localhost:8080/` → 200, titre correct, `/health` et `/sante` → `ok` sur le front comme sur l'api (corps vérifié, pas la page de réveil).
  - Démo (`e2e/demo.spec.ts`) : non mise à jour cette fois (budget consacré au flow, Playwright toujours inexécutable sur cette machine — cf. itération 1). Reporté à l'itération suivante si le temps le permet.
  - **Modifications** :
    - `frontend/src/data/seances.ts` : ajout de `traiterDemandeDeReport` — critères 1 et 2.
    - `frontend/src/data/seances.test.ts` : 2 tests sur `traiterDemandeDeReport`.
    - `frontend/src/app/page.tsx` : composant client, 4 écrans, navigation — critères 1, 2 et 3.
    - `frontend/src/app/page.module.css` : styles des 3 nouveaux écrans.

## Itération 3 (ad hoc) : nouvelle charte « SaaS » (sidebar + KPI), remplace la charte prototype

- **Origine** : demande du développeur, hors plan initial — remplacer la charte visuelle du prototype (mobile, marine/vert/mer) par un design desktop façon Microsoft Planner/Notion : sidebar bleu dégradé, header avec recherche, 4 cartes KPI, panneau « Séances à venir », panneau « Validations en attente », panneau « Rappels automatiques ». 15 minutes annoncées.
- ⚠️ Décisions prises sans validation explicite, faute de temps pour les poser en question : (1) barre de recherche et cloche de notification sont cosmétiques, non branchées ; (2) les 4 chiffres des cartes KPI sont **calculés depuis les données en mémoire** (`compterParStatut`), pas les valeurs d'exemple du brief (8/3/2/24), pour ne pas afficher des chiffres qui ne correspondent à aucune donnée réelle de l'appli ; (3) les icônes sont des emojis, pas Font Awesome, pour ne pas ajouter de dépendance externe (police/CDN) dans le budget — à signaler si l'équipe y tient.
- **Dans le périmètre** :
  - Nouvelle mise en page : sidebar de navigation (256px, dégradé bleu, avatar utilisateur) + header (titre, recherche, cloche, avatar) + zone de contenu, dans `frontend/src/app/page.tsx` et `frontend/src/app/page.module.css` (réécriture complète du design, nouvelle palette #2563eb/jaune/vert/rouge).
  - Écran Tableau de bord : salutation, 4 cartes KPI (planifiées/à confirmer/reportées/réalisées), liste « Séances à venir », panneau « Validations en attente » (bordure orange), panneau « Rappels automatiques ».
  - Écrans Reporter une séance / Validation / Mail : repris de l'itération 2, restylés dans la nouvelle charte (mêmes `panel`, mêmes couleurs).
  - `frontend/src/data/seances.ts` : nouvelle fonction `compterParStatut` (agrégation par statut, logique métier testée) ; jeu de données en dur complété (3 séances de plus) pour que les cartes KPI aient des valeurs non triviales.
- **Hors périmètre** : tout ce qui était déjà hors périmètre des itérations 1 et 2 (vraie base, modèle de données imposé, API, automatisations réelles) ; en plus cette fois : recherche fonctionnelle, notifications réelles, Font Awesome.
- **Critères d'acceptation** :
  - Étant donné le tableau de bord, quand on l'ouvre, alors les 4 cartes KPI affichent des nombres qui correspondent au compte réel des séances par statut dans les données en mémoire.
  - Étant donné le panneau « Validations en attente », quand on clique sur « Voir → », alors l'écran de validation de la séance correspondante s'affiche, dans le même design (sidebar + header conservés implicitement via la navigation).
  - Étant donné n'importe quel écran, quand on regarde la palette, alors plus aucune couleur de l'ancienne charte (marine/vert/mer du prototype) n'apparaît — remplacée par #2563eb et les couleurs de badges du brief.
- **Codage estimé** : 15 minutes (budget annoncé).
- **Bilan** :
  - Durée de codage réelle : 2 minutes (large marge, pas d'alarme).
  - Critères d'acceptation : les 3 satisfaits, vérifiés par lecture du HTML servi (textes et structure présents) ; rendu visuel non vérifié dans un navigateur par l'agent (pas d'accès visuel) — à confirmer par le développeur au premier coup d'œil.
  - Tests unitaires : 1 ajouté sur `compterParStatut` ; `npm test` : 5 tests passent (2 de l'itération 1, 2 de l'itération 2, 1 nouveau).
  - Contrat de déployabilité : `./scripts/verifier-deployabilite.sh` — aucune borne.
  - Déployé : image `frontend` reconstruite et poussée, service recréé. Vérifié en local : `localhost:8080/` → 200 avec le contenu du nouveau tableau de bord, `/health` et `/sante` → `ok` sur le front comme sur l'api.
  - Démo (`e2e/demo.spec.ts`) : non mise à jour (budget consacré au design, toujours inexécutable sur cette machine — cf. itération 1). Les assertions de texte existantes (« Tableau de bord des séances », « Demande de report en attente ») ne correspondent plus aux libellés de ce nouveau design (devenus « Tableau de bord » / « Validations en attente ») — **à corriger avant toute exécution future du script**, noté ici pour ne pas l'oublier.
  - **Modifications** :
    - `frontend/src/data/seances.ts` : `compterParStatut` + 3 séances de données en plus.
    - `frontend/src/data/seances.test.ts` : 1 test sur `compterParStatut`.
    - `frontend/src/app/page.tsx` : réécriture complète (sidebar, header, 4 écrans dans la nouvelle charte).
    - `frontend/src/app/page.module.css` : réécriture complète de la feuille de style.

## À venir (hors budget de cette session)

1. Charger le modèle de données imposé (19 entités depuis `donnees/modele_donnees.json`) et le jeu de test CSV — préalable obligatoire avant tout écran réel.
2. Écran « Qui êtes-vous ? » et droits (admin / coordinatrice / animatrice).
3. Écran Reporter une séance (formulaire animatrice).
4. Écran Validation — Coordinatrice (une validation déclenche agenda + fichier + historique + message).
5. Écran Mail de rappel (J-7/J-2/J-1, bouton reprogrammation).
