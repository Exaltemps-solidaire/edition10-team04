export type TypeDestinataire = "enseignant" | "financeur" | "responsable";

export type Notification = {
  id: string;
  typeDestinataire: TypeDestinataire;
  destinataireNom: string;
  destinataireRole: string;
  objet: string;
  dateEnvoi: string;
  lu: boolean;
};

export const ICONE_DESTINATAIRE: Record<TypeDestinataire, string> = {
  enseignant: "🍎",
  financeur: "💼",
  responsable: "🧭",
};

export const LIBELLE_DESTINATAIRE: Record<TypeDestinataire, string> = {
  enseignant: "Enseignants",
  financeur: "Financeurs",
  responsable: "Responsables",
};

export const notifications: Notification[] = [
  { id: "n1", typeDestinataire: "enseignant", destinataireNom: "M. Durant", destinataireRole: "Enseignant, École Carnot", objet: "Report séance du 7→14 nov", dateEnvoi: "2026-11-02", lu: true },
  { id: "n2", typeDestinataire: "enseignant", destinataireNom: "M. Lemaire", destinataireRole: "Enseignant, École du Port", objet: "Rappel J-7 — Déchets et littoral", dateEnvoi: "2026-11-03", lu: false },
  { id: "n3", typeDestinataire: "enseignant", destinataireNom: "N. Ferreira", destinataireRole: "Enseignante, École Mimont", objet: "Confirmation de la séance du 21 janv.", dateEnvoi: "2026-10-30", lu: true },
  { id: "n4", typeDestinataire: "enseignant", destinataireNom: "S. Benali", destinataireRole: "Enseignante, École des Oliviers", objet: "Rappel J-2 — Risques naturels", dateEnvoi: "2026-11-04", lu: false },
  { id: "n5", typeDestinataire: "financeur", destinataireNom: "Ville de Cannes", destinataireRole: "Financeur", objet: "Bilan trimestriel des séances réalisées", dateEnvoi: "2026-10-28", lu: true },
  { id: "n6", typeDestinataire: "financeur", destinataireNom: "Région Sud", destinataireRole: "Financeur", objet: "Report séance du 28 janv. — Risques naturels", dateEnvoi: "2026-11-01", lu: false },
  { id: "n7", typeDestinataire: "financeur", destinataireNom: "Mairie d'Antibes", destinataireRole: "Financeur", objet: "Confirmation — Déchets et littoral", dateEnvoi: "2026-10-25", lu: true },
  { id: "n8", typeDestinataire: "responsable", destinataireNom: "Direction École Carnot", destinataireRole: "Responsable d'établissement", objet: "Planning du mois de janvier", dateEnvoi: "2026-10-29", lu: true },
  { id: "n9", typeDestinataire: "responsable", destinataireNom: "Direction Collège Jean Moulin", destinataireRole: "Responsable d'établissement", objet: "Report séance du 7→14 nov", dateEnvoi: "2026-11-02", lu: false },
];

export type StatsDestinataire = { total: number; lus: number; tauxLecture: number };

export function compterParDestinataire(liste: Notification[]): Record<TypeDestinataire, StatsDestinataire> {
  const base: Record<TypeDestinataire, StatsDestinataire> = {
    enseignant: { total: 0, lus: 0, tauxLecture: 0 },
    financeur: { total: 0, lus: 0, tauxLecture: 0 },
    responsable: { total: 0, lus: 0, tauxLecture: 0 },
  };
  const compte = liste.reduce((acc, n) => {
    acc[n.typeDestinataire].total += 1;
    if (n.lu) acc[n.typeDestinataire].lus += 1;
    return acc;
  }, base);
  (Object.keys(compte) as TypeDestinataire[]).forEach((type) => {
    const { total, lus } = compte[type];
    compte[type].tauxLecture = total === 0 ? 0 : Math.round((lus / total) * 100);
  });
  return compte;
}
