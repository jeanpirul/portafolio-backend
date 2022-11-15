export interface IActionBodega {
  nombreResponsable: string;
  nombreRol?: string;
  nombreProducto: string;
  cantidad: number;
  precio: number;
  totalPago?: number;
  detalleActionBodega: string;
}
