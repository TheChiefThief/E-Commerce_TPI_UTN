const backendErrorMessage = {
  "AUTH-1001": 'Token inválido para la autenticación.',
  "AUTH-1002": 'Token expirado para la autenticación.',
  "AUTH-1003": 'Credenciales inválidas para la autenticación.',
  "AUTH-1004": 'Acceso no autorizado (401).',
  "AUTH-2001": 'Acceso prohibido. No tiene permisos suficientes.',
  "AUTH-2002": 'Permisos insuficientes para la operación.',

  

  "VAL-1001": 'Error de validación de los datos.',
  "VAL-1002": 'Formato de correo inválido.',
  "VAL-1003": 'Contraseña demasiado débil.',
  "VAL-1004": 'Solicitud inválida (400).',
  "VAL-1005": 'Datos inválidos en la solicitud.',
  "VAL-1006": 'Operación inválida.',
  "VAL-1007": 'Cantidad ingresada inválida.',

  "RES-4001": 'Entidad no encontrada.',
  "RES-4002": 'No se encuentra el recurso solicitado.',
  "RES-4003": 'El recurso existe pero no tiene contenido.',
  "RES-4004": 'Conflicto de recursos (409).',
  "RES-4005": 'Entidad duplicada.',
  "RES-4006": 'El correo electrónico ya está en uso.',

  "SYS-5001": 'Error del servicio externo.',
  "SYS-5002": 'Error de configuración.',
  "SYS-5003": 'Error de serialización.',
  "SYS-5004": 'Servicio no disponible.',
  "SYS-5005": 'Demoró mucho la solicitud.',
  "SYS-4001": 'Muchas solicitudes.',
  "SYS-5006": 'No implementado.',
  "SYS-1001": 'Error de aplicación interna.',

  "SYS-9999": 'Error desconocido.'
}

export {
  backendErrorMessage,
};