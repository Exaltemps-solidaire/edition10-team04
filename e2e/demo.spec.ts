import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je consulte le tableau de bord des séances", async () => {
    await expect(page.getByText("Tableau de bord des séances")).toBeVisible();
    await expect(page.getByText("Demande de report en attente").first()).toBeVisible();
  });
});
