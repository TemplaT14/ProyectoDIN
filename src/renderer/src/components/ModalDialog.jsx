// renderer/src/components/ModalDialog.jsx
export default function ModalDialog({ message, onConfirm, onClose }) {
  if (!message) return null

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            {onConfirm && (
              <button className="btn btn-primary" onClick={onConfirm}>
                Aceptar
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
