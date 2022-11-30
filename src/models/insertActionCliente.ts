export interface IActionCliente {
  fk_User: number;
  nombreResponsable: string;
  nombreRol?: string;
  nombrePedido: string;
  estadoPedido: string;
  pedidoEntregado: boolean;
  detalleActionCliente: string;
}
