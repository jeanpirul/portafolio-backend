export interface IActionPedido {
  nombreResponsable: string;
  nombreRol?: string;
  nombrePedido: string;
  cantidad: number;
  precio: number;
  total: number;
  tipoPago: string;
  mesa: string;
  cantidadPersonas: number;
  detalleActionPedido: string;
}
