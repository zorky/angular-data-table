export interface ActionDataTable {
  label: string;
  /* tooltip bouton */
  // tooltip: string;
  tooltip:string;
  /* icon material */
  icon: string;
  /* action (fonction) au click */
  click: (row) => void;
  /* flex colonne */
  flex?: number;
  /* afficher ?*/
  hidden?: (row) => boolean;
}
