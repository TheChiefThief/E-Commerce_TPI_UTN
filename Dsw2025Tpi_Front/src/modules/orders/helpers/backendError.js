const backendErrorMessage = {
  "ORDER-1001": 'Estado de orden inválido.', // Antes ORD-1001 y Solicitud inválida
  "ORDER-1002": 'La orden ya ha sido cancelada.', // Antes ORD-1002
  "ORDER-4001": 'La orden ya se encuentra duplicada.', // Antes ORD-4001

  "CUST-4001": 'El cliente no existe.',

  "SYS-5001": 'Error del servicio externo.',
  "SYS-5002": 'Error de configuración.',
  "SYS-5003": 'Error de serialización.',
  "SYS-5004": 'Servicio no disponible.',
  "SYS-5005": 'Demoró mucho la solicitud.',
  "SYS-4001": 'Muchas solicitudes.',
  "SYS-5006": 'No implementado.',
  "SYS-1001": 'Error de aplicación interna.',

  "SYS-9999": 'Error desconocido.'

};

export { backendErrorMessage };
