export interface IActionCocina {
  fk_User: number;
  nombreResponsable: string;
  nombreRol?: string;
  nombrePedido: string;
  estadoPedido: string;
  listoEntrega: boolean;
  pedidoEntregado: boolean;
  detalleActionCocina: string;
}
