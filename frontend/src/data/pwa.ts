export function doitAfficherInstallation(
  estStandalone: boolean,
  aPromptDiffere: boolean,
  estIOS: boolean,
): boolean {
  return !estStandalone && (aPromptDiffere || estIOS);
}
