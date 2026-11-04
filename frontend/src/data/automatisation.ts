export type StatutEtape = "en_attente" | "terminee";

export type ClasseCouleurEtape = "bleu" | "vert" | "orange" | "violet" | "indigo";

export type EtapeAutomatisation = {
  id: string;
  titre: string;
  description: string;
  icone: string;
  classeCouleur: ClasseCouleurEtape;
};

export const DELAI_ETAPE_MS = 600;

export const etapesAutomatisation: EtapeAutomatisation[] = [
  { id: "outlook", titre: "Outlook mis à jour", description: "Événement déplacé dans le calendrier partagé", icone: "📅", classeCouleur: "bleu" },
  { id: "excel", titre: "Excel mis à jour", description: "Tableau de suivi mis à jour automatiquement", icone: "📊", classeCouleur: "vert" },
  { id: "enseignant", titre: "Enseignant informé", description: "E-mail envoyé à Mme Leclerc", icone: "🍎", classeCouleur: "orange" },
  { id: "financeur", titre: "Financeur informé", description: "Notification envoyée à la CAF", icone: "💼", classeCouleur: "violet" },
  { id: "historique", titre: "Historique enregistré", description: "Trace complète conservée", icone: "🕒", classeCouleur: "indigo" },
];

export function avancerEtape(statuts: StatutEtape[], index: number): StatutEtape[] {
  return statuts.map((statut, i) => (i === index ? "terminee" : statut));
}

export function toutesTerminees(statuts: StatutEtape[]): boolean {
  return statuts.length > 0 && statuts.every((statut) => statut === "terminee");
}
