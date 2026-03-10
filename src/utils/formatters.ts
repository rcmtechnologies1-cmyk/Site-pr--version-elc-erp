/**
 * Utilitaires de formatage des données
 * Pour une présentation cohérente dans toute l'application
 */

/**
 * Formate un pourcentage avec 1 décimale et un signe
 * @param value Valeur numérique du pourcentage (ex: 12.5)
 * @returns String formatée (ex: "+12.5%" ou "-3.2%")
 */
export function formatPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10; // Arrondi à 1 décimale
  const sign = rounded > 0 ? '+' : '';
  return `${sign}${rounded.toFixed(1)}%`;
}

/**
 * Formate un montant en FCFA avec séparateurs de milliers
 * @param amount Montant numérique
 * @returns String formatée (ex: "1 250 000")
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount);
}

/**
 * Formate un montant en millions de FCFA
 * @param amount Montant numérique
 * @returns String formatée (ex: "12.5M FCFA")
 */
export function formatAmountInMillions(amount: number): string {
  const millions = amount / 1000000;
  return `${millions.toFixed(1)}M FCFA`;
}

/**
 * Formate une date au format français court
 * @param dateString Date en format ISO (ex: "2026-03-02")
 * @returns String formatée (ex: "2 mars 2026")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}

/**
 * Formate une date au format français abrégé
 * @param dateString Date en format ISO
 * @returns String formatée (ex: "2 mars")
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  });
}
