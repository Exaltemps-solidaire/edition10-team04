export type StatutSeance = "a_confirmer" | "confirmee" | "realisee" | "reportee";

export type Seance = {
  id: string;
  projet: string;
  ecole: string;
  classe: string;
  enseignant: string;
  animateur: string;
  financeur: string;
  date: string;
  heure: string;
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
    classe: "CE2",
    enseignant: "M. Durant",
    animateur: "Lucia M.",
    financeur: "Ville de Cannes",
    date: "2027-01-14",
    heure: "09:00",
    statut: "confirmee",
    demandeDeReportEnAttente: false,
  },
  {
    id: "2",
    projet: "Déchets et littoral",
    ecole: "École du Port (Antibes)",
    classe: "CE2",
    enseignant: "M. Lemaire",
    animateur: "P. Renaud",
    financeur: "Mairie d'Antibes",
    date: "2027-01-16",
    heure: "09:00",
    statut: "a_confirmer",
    demandeDeReportEnAttente: true,
  },
  {
    id: "3",
    projet: "Eau et milieu marin",
    ecole: "École Mimont (Cannes)",
    classe: "CM1",
    enseignant: "N. Ferreira",
    animateur: "Lucia M.",
    financeur: "Ville de Cannes",
    date: "2027-01-21",
    heure: "10:00",
    statut: "confirmee",
    demandeDeReportEnAttente: false,
  },
  {
    id: "4",
    projet: "Alimentation durable",
    ecole: "Collège Jean Moulin",
    classe: "6e",
    enseignant: "M. Durant",
    animateur: "P. Renaud",
    financeur: "Région Sud",
    date: "2027-01-23",
    heure: "14:00",
    statut: "realisee",
    demandeDeReportEnAttente: false,
  },
  {
    id: "5",
    projet: "Risques naturels",
    ecole: "École des Oliviers",
    classe: "CM2",
    enseignant: "S. Benali",
    animateur: "Lucia M.",
    financeur: "Région Sud",
    date: "2027-01-28",
    heure: "09:00",
    statut: "reportee",
    demandeDeReportEnAttente: true,
  },
  {
    id: "6",
    projet: "Mer et plastique",
    ecole: "École Carnot (Cannes)",
    classe: "CE1",
    enseignant: "M. Durant",
    animateur: "P. Renaud",
    financeur: "Ville de Cannes",
    date: "2027-02-02",
    heure: "09:00",
    statut: "confirmee",
    demandeDeReportEnAttente: false,
  },
  {
    id: "7",
    projet: "Zones humides",
    ecole: "École des Oliviers",
    classe: "CM2",
    enseignant: "S. Benali",
    animateur: "Lucia M.",
    financeur: "Région Sud",
    date: "2027-02-04",
    heure: "10:00",
    statut: "a_confirmer",
    demandeDeReportEnAttente: false,
  },
  {
    id: "8",
    projet: "Forêt méditerranéenne",
    ecole: "Collège Jean Moulin",
    classe: "5e",
    enseignant: "M. Durant",
    animateur: "P. Renaud",
    financeur: "Région Sud",
    date: "2026-12-12",
    heure: "14:00",
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

export function changerStatut(liste: Seance[], id: string, statut: StatutSeance): Seance[] {
  return liste.map((seance) => (seance.id === id ? { ...seance, statut } : seance));
}

export type FiltresSeances = {
  projet?: string;
  animateur?: string;
  statut?: StatutSeance;
  mois?: string;
};

export function filtrerSeances(liste: Seance[], filtres: FiltresSeances): Seance[] {
  return liste.filter((seance) => {
    if (filtres.projet && seance.projet !== filtres.projet) return false;
    if (filtres.animateur && seance.animateur !== filtres.animateur) return false;
    if (filtres.statut && seance.statut !== filtres.statut) return false;
    if (filtres.mois && !seance.date.startsWith(filtres.mois)) return false;
    return true;
  });
}
