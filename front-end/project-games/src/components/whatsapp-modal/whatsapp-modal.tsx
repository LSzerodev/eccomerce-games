"use client";

import styles from "./whatsapp-modal.module.css";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  if (!isOpen) return null;

  const whatsappLink = "https://wa.me/5567998797391?text=Comprei%20o%20";

  const handleSendMessage = () => {
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <p className={styles.modalText}>
          Para resgatar o seu item, envie uma mensagem nesse whatsapp aqui de baixo
        </p>
        <button className={styles.sendButton} onClick={handleSendMessage}>
          Enviar mensagem
        </button>
      </div>
    </div>
  );
}









