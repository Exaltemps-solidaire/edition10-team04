# Déploiement

MédiPlan aide les coordinatrices et animatrices de Méditerranée 2000 à suivre leurs séances d'intervention en classe et leurs demandes de report, sans double saisie entre Outlook et Excel.

## Services

- `frontend/` — exposé publiquement. Next.js exporté en site statique, servi par nginx sur le port 80 du conteneur (8080 sur la VM).
- `api/` — `api/health` et `api/sante` seulement pour l'instant. Port 8081 du conteneur, publié sur 8081.

## Services externes

Aucun à ce jour : pas d'appel IA, d'e-mail ni de base de données dans cette itération. Les séances affichées sont des données en dur dans `frontend/src/data/seances.ts`.

## Connu comme fragile ou inachevé

- Le modèle de données imposé par l'association (19 entités, jeu de test) n'est pas encore créé : aucune persistance, tout est en dur.
- Un seul écran livré (Tableau de bord) ; les écrans Reporter une séance, Validation — Coordinatrice et Mail de rappel restent à faire.
- `api/` ne sert que `/health` et `/sante` : le front ne l'appelle pas encore.
- Pas d'écran « Qui êtes-vous ? » : l'utilisateur affiché (Claire Lefèvre, coordinatrice) est fixe.

## Contact

Équipe : squad Corazòn (team04). Association : Méditerranée 2000.
