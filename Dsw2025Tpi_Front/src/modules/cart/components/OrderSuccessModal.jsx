import { useEffect } from 'react';
import Button from '../../shared/components/Button';

const OrderSuccessModal = ({ isOpen, onClose, orderData }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[slideUp_0.3s_ease-out]">
        {/* Header con gradiente animado de naranja a verde */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center animate-[colorShift_1.5s_ease-in-out_forwards]">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-3 animate-[scaleIn_0.5s_ease-out_0.3s_backwards]">
              <svg 
                className="w-16 h-16 text-orange-500 animate-[colorChange_1.5s_ease-in-out_forwards]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">¡Orden Creada!</h2>
          <p className="text-orange-50 animate-[fadeText_1.5s_ease-in-out_forwards]">Tu pedido ha sido procesado exitosamente</p>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Número de orden</span>
              <span className="font-mono font-semibold text-gray-900">
                #{orderData?.id || 'Generando...'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total</span>
              <span className="font-bold text-xl text-green-600">
                ${orderData?.total?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-gray-600">
                  Recibirás una confirmación por correo electrónico con los detalles de tu pedido.
                </p>
              </div>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="secondary"
              className="flex-1 py-3 rounded-lg font-medium"
            >
              Seguir Comprando
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes colorShift {
          0% {
            background: linear-gradient(to right, rgb(249, 115, 22), rgb(251, 146, 60));
          }
          100% {
            background: linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129));
          }
        }
        
        @keyframes colorChange {
          0% {
            color: rgb(249, 115, 22);
          }
          100% {
            color: rgb(34, 197, 94);
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fadeText {
          0% {
            color: rgb(254, 215, 170);
          }
          100% {
            color: rgb(187, 247, 208);
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessModal;
