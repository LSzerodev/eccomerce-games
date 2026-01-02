import styles from "./support-section.module.css";
import { MdMessage, MdLock } from "react-icons/md";
import { BiSolidCheckShield, BiCheckCircle } from "react-icons/bi";

export function SupportSection() {
  return (
    <div className={styles.supportSection}>
      <div className={styles.leftSide}>
        <div className={styles.supportItem}>
          <div className={styles.iconBlock}>
            <MdMessage size={34} color="#6CFFC0" />
          </div>
          <div className={styles.content}>
            <h1>Converse com a gente</h1>
            <p>Se tiver dúvidas não hesite nos chamar para ajudarmos pelo chat</p>
          </div>
        </div>

        <div className={styles.supportItem}>
          <div className={styles.iconBlock}>
            <BiSolidCheckShield size={34} color="#6CFFC0" />
          </div>
          <div className={styles.content}>
            <h1>Compra Segura</h1>
            <p>Você recebe a chave do jogo no seu e-mail em segundos</p>
          </div>
        </div>
      </div>

      <div className={styles.centralDot}></div>

      <div className={styles.rightSide}>
        <div className={styles.supportItem}>
          <div className={styles.iconBlock}>
            <MdLock size={34} color="#6CFFC0" />
          </div>
          <div className={styles.content}>
            <h1>Seus dados protegidos</h1>
            <p>Segurança garantida em todas as transações de pagamento</p>
          </div>
        </div>

        <div className={styles.supportItem}>
          <div className={styles.iconBlock}>
            <BiCheckCircle size={34} color="#6CFFC0" />
          </div>
          <div className={styles.content}>
            <h1>Garantia de funcionamento</h1>
            <p>Se o código não funcionar, devolvemos seu dinheiro</p>
          </div>
        </div>
      </div>
    </div>
  );
}
