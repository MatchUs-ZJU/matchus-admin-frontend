import React from 'react';
import styles from './index.less';

const Record = ({ id, sum, updateTime, subtotal, reason, handleDelete }) => {
  return (
    <div className={styles.record}>
      <div className={styles.recordinfo}>
        <div className={styles.value}>
          <div className={subtotal > 0 ? styles.change : styles.minusChange}>
            {subtotal > 0 && '+'}
            {subtotal}
          </div>
          <div className={subtotal > 0 ? styles.total : styles.minusTotal}>{sum}</div>
        </div>
        <div className={styles.reason}>
          <div className={styles.description}>{reason}</div>
          <div className={styles.time}>{updateTime}</div>
        </div>
      </div>
      <div className={styles.cancel} onClick={() => handleDelete(id)}>
        撤销
      </div>
    </div>
  );
};

export default Record;
