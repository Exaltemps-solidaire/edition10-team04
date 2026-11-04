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
  {
    id: "6",
    projet: "Mer et plastique",
    ecole: "École Carnot (Cannes)",
    enseignant: "Lucia M.",
    date: "2027-02-02",
    statut: "confirmee",
    demandeDeReportEnAttente: false,
  },
  {
    id: "7",
    projet: "Zones humides",
    ecole: "École des Oliviers",
    enseignant: "S. Benali",
    date: "2027-02-04",
    statut: "a_confirmer",
    demandeDeReportEnAttente: false,
  },
  {
    id: "8",
    projet: "Forêt méditerranéenne",
    ecole: "Collège Jean Moulin",
    enseignant: "M. Durant",
    date: "2026-12-12",
    statut: "realisee",
    demandeDeReportEnAttente: false,
  },
];

export function seancesAvecReportEnAttente(liste: Seance[]): Seance[] {
  return liste.filter((seance) => seance.demandeDeReportEnAttente);
}

export function compterParStatut(liste: Seance[]): Record<StatutSeance, number> {
  return liste.reduce(
    (compte, seance) => ({ ...compte, [seance.statut]: compte[seance.statut] + 1 }),
    { a_confirmer: 0, confirmee: 0, realisee: 0, reportee: 0 } as Record<StatutSeance, number>,
  );
}

export type DecisionReport = "validee" | "refusee";

export function traiterDemandeDeReport(
  liste: Seance[],
  id: string,
  decision: DecisionReport,
  nouvelleDate?: string,
): Seance[] {
  return liste.map((seance) =>
    seance.id === id
      ? {
          ...seance,
          demandeDeReportEnAttente: false,
          statut: decision === "validee" ? "reportee" : seance.statut,
          date: decision === "validee" && nouvelleDate ? nouvelleDate : seance.date,
        }
      : seance,
  );
}
