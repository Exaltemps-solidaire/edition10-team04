export type StatutSeance = "a_confirmer" | "confirmee" | "realisee" | "reportee";

export type Seance = {
  id: string;
  projet: string;
  ecole: string;
  enseignant: string;
  date: string;
  statut: StatutSeance;
  demandeDeReportEnAttente: boolean;
};

export const LIBELLE_STATUT: Record<StatutSeance, string> = {
  a_confirmer: "À confirmer",
  confirmee: "Confirmée",
  realisee: "Réalisée",
  reportee: "Reportée",
};

export const seances: Seance[] = [
  {
    id: "1",
    projet: "Abeilles et biodiversité",
    ecole: "École Carnot (Cannes)",
    enseignant: "Lucia M.",
    date: "2027-01-14",
    statut: "confirmee",
    demandeDeReportEnAttente: false,
  },
  {
    id: "2",
    projet: "Déchets et littoral",
    ecole: "École du Port (Antibes)",
    enseignant: "P. Renaud",
    date: "2027-01-16",
    statut: "a_confirmer",
    demandeDeReportEnAttente: true,
  },
  {
    id: "3",
    projet: "Eau et milieu marin",
    ecole: "École Mimont (Cannes)",
    enseignant: "N. Ferreira",
    date: "2027-01-21",
    statut: "confirmee",
    demandeDeReportEnAttente: false,
  },
  {
    id: "4",
    projet: "Alimentation durable",
    ecole: "Collège Jean Moulin",
    enseignant: "M. Durant",
    date: "2027-01-23",
    statut: "realisee",
    demandeDeReportEnAttente: false,
  },
  {
    id: "5",
    projet: "Risques naturels",
    ecole: "École des Oliviers",
    enseignant: "S. Benali",
    date: "2027-01-28",
    statut: "reportee",
    demandeDeReportEnAttente: true,
  },
];

export function seancesAvecReportEnAttente(liste: Seance[]): Seance[] {
  return liste.filter((seance) => seance.demandeDeReportEnAttente);
}
