export interface IActionBodega {
  fk_User: string;
  nombreResponsable: string;
  nombreRol?: string;
  nombreProducto: string;
  cantidad: number;
  precio: number;
  totalPago?: number;
  detalleActionBodega: string;
}
