export interface InsertBitacoraInterface {
  nameTableAction: string;
  idUser: string;
  nameRole?: string;
  userName: string;
  actionDetail: string;
}

export interface InsertProducto {
  nombreProducto: string;
  cantidad: number;
  precio: number;
  fk_User: number;
}
