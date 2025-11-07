
// Este es un componente 'tonto', solo muestra cosas
// Recibe el mensaje y las funciones (onConfirm, onClose) desde el componente 'padre'
export default function ModalDialog({ message, onConfirm, onClose }) {
  //si no hay 'message', no se muestra nada (null)
  if (!message) return null // asi lo controlamos desde el "useState" del padre (poniendolo a null lo cerramos)

  return (
    // el fondo oscuro semitransparente
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
             {/* aqui se muestra el mensaje q le pasamos */} <p>{message}</p>
          </div>
          <div className="modal-footer">
            {/*El boton de Aceptar solo aparece si le pasamos
					 	la funcion onConfirm */}
            {onConfirm && (
              <button className="btn btn-primary" onClick={onConfirm}>
                 Aceptar 
              </button>
            )}
             {/* El boton de cerrar siempre esta */}
            <button className="btn btn-secondary" onClick={onClose}>
               Cerrar 
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
