export interface ColumnDataTable {
  /* champs 'table' à afficher (et à trier le cas échéant) */
  columnDef: string,
  /* libellé de l'entête table */
  header: string,
  /* fonction d'obtention de la valeur du champ pour la ligne courante */
  display: (any) => any;
  /* flex largeur */
  flex?: number,
  /* fonction d'obtention de la couleur d'affichage de la valeur du champ, optionnel, par défaut #000000 (noir) */
  color?: (any) => string;
  /* tri actif ou non */
  sort: boolean;
  /* champ de tri si différent de columnDef, optionnel */
  sortField?: string;
  /*  afficher ? */
  hidden?: boolean;
  /* tooltip */
  tooltip?: (any) => any;
}
