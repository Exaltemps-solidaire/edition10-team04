export type CanalEvenement = "mobile" | "email" | "app";
export type TypeEvenement = "creation" | "confirmation" | "report" | "validation" | "rappel" | "a_venir";

export type EvenementHistorique = {
  id: string;
  type: TypeEvenement;
  titre: string;
  date: string;
  heure: string;
  acteurNom: string;
  acteurRole: string;
  canal: CanalEvenement;
  motif?: string;
  ancienneDate?: string;
  nouvelleDate?: string;
  actionsAuto?: string[];
};

export const ICONE_EVENEMENT: Record<TypeEvenement, string> = {
  creation: "+",
  confirmation: "✓",
  report: "↻",
  validation: "📋",
  rappel: "🔔",
  a_venir: "🚩",
};

export const LIBELLE_CANAL: Record<CanalEvenement, string> = {
  mobile: "📱 Mobile",
  email: "✉️ Email",
  app: "💻 Application",
};

export const seanceHistoriqueId = "2";

export const evenementsHistorique: EvenementHistorique[] = [
  {
    id: "h1",
    type: "creation",
    titre: "Création de la séance",
    date: "2026-10-01",
    heure: "09:30",
    acteurNom: "Sophie Lefèvre",
    acteurRole: "Coordinatrice",
    canal: "app",
  },
  {
    id: "h2",
    type: "confirmation",
    titre: "Confirmation",
    date: "2026-10-05",
    heure: "16:12",
    acteurNom: "M. Lemaire",
    acteurRole: "Enseignant",
    canal: "email",
  },
  {
    id: "h3",
    type: "report",
    titre: "Demande de report",
    date: "2026-10-20",
    heure: "08:45",
    acteurNom: "P. Renaud",
    acteurRole: "Animateur",
    canal: "mobile",
    ancienneDate: "2027-01-16",
    nouvelleDate: "2027-01-23",
    motif: "Indisponibilité de l'école",
  },
  {
    id: "h4",
    type: "validation",
    titre: "Validation coordinatrice",
    date: "2026-10-21",
    heure: "11:00",
    acteurNom: "Sophie Lefèvre",
    acteurRole: "Coordinatrice",
    canal: "app",
    actionsAuto: [
      "Agenda Outlook mis à jour",
      "Fichier Excel du projet mis à jour",
      "Historique du report enregistré",
      "E-mail de confirmation envoyé à l'enseignant",
    ],
  },
  {
    id: "h5",
    type: "rappel",
    titre: "Rappel automatique J-7",
    date: "2027-01-16",
    heure: "08:00",
    acteurNom: "Système",
    acteurRole: "Rappel automatique",
    canal: "email",
  },
  {
    id: "h6",
    type: "a_venir",
    titre: "Séance à venir",
    date: "2027-01-23",
    heure: "09:00",
    acteurNom: "—",
    acteurRole: "En attente de réalisation",
    canal: "app",
  },
];

export function trierChronologiquement(liste: EvenementHistorique[]): EvenementHistorique[] {
  return [...liste].sort((a, b) => `${a.date}T${a.heure}`.localeCompare(`${b.date}T${b.heure}`));
}
