export const success = async (results: object, statusCode: number) => {
    return {
      message: messageCode(statusCode),
      error: false,
      code: statusCode,
      results
    };
  };
  
  export const error = async (statusCode: number, errorCustomMessage?: string) => {
    /**
     * List of common HTTP request code
     * @note  You can add more http request code in here
     */
    const codes = [200, 201, 400, 401, 403, 404, 409, 422, 500];
  
    // message code = llave-valor sacar mensaje y controlar en esta función
  
    // Get matched code
    const findCode = codes.find((code) => code == statusCode);
  
    if (!findCode) statusCode = 500;
    else statusCode = findCode;
  
    const mensajeError = errorCustomMessage ? errorCustomMessage : messageCode(statusCode);
  
    return {
      message: mensajeError,
      code: statusCode,
      error: true
    };
  };
  
  const messageCode = (statusCode: any): string => {
    const messages: any = [
      { 200: 'La consulta se ha efectuado exitosamente.' },
      { 201: 'La solicitud de creación de la entidad se ha efectuado exitosamente.' },
      { 400: 'La petición no pudo ser procesada por posible error en los parámetros.' },
      { 401: 'Consulta no autorizada.' },
      { 403: 'Consulta prohibida por falta de privilegios.' },
      { 404: 'Solicitud no encontrada.' },
      { 409: 'Se ha producido un conflicto en la petición solicitada' },
      { 422: 'La petición solicitada no se ha completado. Flujo de la solicitud completado correctamente.' },
      { 500: 'Error al procesar la consulta, error interno.' }
    ];
  
    return messages.find((msg: any): string => { return msg[statusCode] })?.[statusCode];
  };