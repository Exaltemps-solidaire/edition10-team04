# Déploiement

MédiPlan aide les coordinatrices et animatrices de Méditerranée 2000 à suivre leurs séances d'intervention en classe et leurs demandes de report, sans double saisie entre Outlook et Excel.

## Services

- `frontend/` — exposé publiquement. Next.js exporté en site statique, servi par nginx sur le port 80 du conteneur (8080 sur la VM).
- `api/` — `api/health` et `api/sante` seulement pour l'instant. Port 8081 du conteneur, publié sur 8081.

## Services externes

Aucun à ce jour : pas d'appel IA, d'e-mail ni de base de données. Les séances affichées sont des données en dur dans `frontend/src/data/seances.ts`, tenues en mémoire côté navigateur (un rechargement de page réinitialise tout).

## Connu comme fragile ou inachevé

- Le modèle de données imposé par l'association (19 entités, jeu de test) n'est pas encore créé : aucune persistance réelle, tout est en dur et en mémoire côté client.
- Écrans livrés (mock, sans backend) : Tableau de bord, Séances (tableau filtrable + détail), Reporter une séance, Validation — Coordinatrice, Mail de rappel. Les actions de confirmation/report/validation changent l'état en mémoire, mais rien n'est envoyé à un serveur.
- Écrans encore à l'état de coquille (« à venir ») : Notifications, Historique, Parties prenantes — présents dans la navigation, sans contenu.
- Les boutons « Nouvelle séance », « Exporter Excel » et « Exporter PDF » sont visuels, sans action.
- `api/` ne sert que `/health` et `/sante` : le front ne l'appelle pas encore.
- Pas d'écran « Qui êtes-vous ? » : l'utilisatrice affichée (Sophie Lefèvre, coordinatrice) est fixe.
- `e2e/demo.spec.ts` existe et est tenu à jour avec les écrans actuels, mais n'a pas pu être exécuté sur cette machine : Chromium Playwright est installé, mais il manque des bibliothèques système (`libnspr4.so` et consorts) ; les installer demanderait des droits root sur une machine partagée, ce qui n'a pas été fait.

## Contact

Équipe : squad Corazòn (team04). Association : Méditerranée 2000.
