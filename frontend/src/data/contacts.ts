export type TypeContact = "enseignant" | "financeur" | "elu";

export type Contact = {
  id: string;
  typeContact: TypeContact;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  organisation: string;
  detail?: string;
  nbSeances: number;
};

export const LIBELLE_TYPE_CONTACT: Record<TypeContact, string> = {
  enseignant: "Enseignants",
  financeur: "Financeurs",
  elu: "Élus / Responsables",
};

export const ICONE_TYPE_CONTACT: Record<TypeContact, string> = {
  enseignant: "🍎",
  financeur: "👔",
  elu: "🏛️",
};

export const LABELS_CHAMPS_CONTACT: Record<TypeContact, { organisation: string; detail: string }> = {
  enseignant: { organisation: "École", detail: "Classe" },
  financeur: { organisation: "Organisation", detail: "Type" },
  elu: { organisation: "Collectivité", detail: "Titre" },
};

export const TYPES_FINANCEUR = ["CAF", "Mairie", "État", "Autre"] as const;

export const contacts: Contact[] = [
  { id: "c1", typeContact: "enseignant", prenom: "Antoine", nom: "Durant", email: "a.durant@ac-nice.fr", telephone: "04 93 00 00 01", organisation: "École Carnot (Cannes)", detail: "CE1", nbSeances: 4 },
  { id: "c2", typeContact: "enseignant", prenom: "Julien", nom: "Lemaire", email: "j.lemaire@ac-nice.fr", organisation: "École du Port (Antibes)", detail: "CE2", nbSeances: 1 },
  { id: "c3", typeContact: "enseignant", prenom: "Nadia", nom: "Ferreira", email: "n.ferreira@ac-nice.fr", telephone: "04 93 00 00 03", organisation: "École Mimont (Cannes)", detail: "CM1", nbSeances: 1 },
  { id: "c4", typeContact: "enseignant", prenom: "Sami", nom: "Benali", email: "s.benali@ac-nice.fr", organisation: "École des Oliviers", detail: "CM2", nbSeances: 2 },
  { id: "c5", typeContact: "financeur", prenom: "Claire", nom: "Petit", email: "c.petit@cannes.fr", telephone: "04 92 00 00 05", organisation: "Ville de Cannes", detail: "Mairie", nbSeances: 3 },
  { id: "c6", typeContact: "financeur", prenom: "Thomas", nom: "Roy", email: "t.roy@antibes.fr", organisation: "Mairie d'Antibes", detail: "Mairie", nbSeances: 1 },
  { id: "c7", typeContact: "financeur", prenom: "Hélène", nom: "Faure", email: "h.faure@maregionsud.fr", telephone: "04 91 00 00 07", organisation: "Région Sud", detail: "Autre", nbSeances: 4 },
  { id: "c8", typeContact: "elu", prenom: "Isabelle", nom: "Roux", email: "i.roux@cannes.fr", organisation: "Ville de Cannes", detail: "Adjointe à l'éducation", nbSeances: 3 },
  { id: "c9", typeContact: "elu", prenom: "Marc", nom: "Giraud", email: "m.giraud@maregionsud.fr", telephone: "04 91 00 00 09", organisation: "Région Sud", detail: "Conseiller régional", nbSeances: 4 },
];

export function initiales(prenom: string, nom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

export function ajouterContact(liste: Contact[], nouveau: Omit<Contact, "id" | "nbSeances">): Contact[] {
  return [...liste, { ...nouveau, id: `c-nouveau-${liste.length + 1}`, nbSeances: 0 }];
}
