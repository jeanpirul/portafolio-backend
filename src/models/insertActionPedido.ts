export interface IActionPedido {
  nombreResponsable: string;
  nombreRol?: string;
  nombrePedido: string;
  cantidad: number;
  precio: number;
  total: number;
  tipoPago: string;
  mesa: number;
  cantidadPersonas: number;
  detalleActionPedido: string;
}
