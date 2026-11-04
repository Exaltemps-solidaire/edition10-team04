import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je consulte le tableau de bord des séances", async () => {
    await expect(page.getByText("Bonjour Sophie")).toBeVisible();
    await expect(page.getByText("Validations en attente")).toBeVisible();
  });

  await test.step("Je consulte la liste complète des séances", async () => {
    await page.getByRole("button", { name: /Séances/ }).click();
    await expect(page.getByRole("columnheader", { name: "Projet" })).toBeVisible();
  });

  await test.step("J'ouvre le détail d'une séance et je la confirme", async () => {
    await page.locator("table tbody tr").first().click();
    await expect(page.getByRole("button", { name: "Confirmer" })).toBeVisible();
    await page.getByRole("button", { name: "Confirmer" }).click();
  });
});
