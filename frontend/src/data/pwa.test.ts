import { describe, expect, it } from "vitest";
import { doitAfficherInstallation } from "./pwa";

describe("doitAfficherInstallation", () => {
  it("ne montre jamais l'installation si l'app tourne déjà en standalone", () => {
    expect(doitAfficherInstallation(true, true, true)).toBe(false);
  });

  it("montre l'installation si un prompt différé Android/Chrome est disponible", () => {
    expect(doitAfficherInstallation(false, true, false)).toBe(true);
  });

  it("montre l'installation sur iOS même sans prompt différé (pas d'API beforeinstallprompt)", () => {
    expect(doitAfficherInstallation(false, false, true)).toBe(true);
  });
});
