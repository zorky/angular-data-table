export interface ListParameters {
  /* limite de pagination (taille page) */
  limit: number;
  /* début de pagination >= 0 */
  offset: number;

  /* champ de tri */
  sort?: string;
  /* ordre de tri : asc | desc */
  order?: string;

  /* paramètres supplémentaires à passer au GET */
  extraParams?: Map<string, string>;
  /* mot de recherche le cas échéant */
  keyword?: string;
}
