import React from 'react';
import styles from './index.less';

const Record = ({ sum, updateTime, subTotal, reason }) => {
  return (
    <div className={styles.record}>
      <div className={styles.recordinfo}>
        <div className={styles.value}>
          <div className={subTotal > 0 ? styles.change : styles.minusChange}>
            {subTotal > 0 && '+'}
            {subTotal}
          </div>
          <div className={subTotal > 0 ? styles.total : styles.minusTotal}>{sum}</div>
        </div>
        <div className={styles.reason}>
          <div className={styles.description}>{reason}</div>
          <div className={styles.time}>{updateTime}</div>
        </div>
      </div>
      <div className={styles.cancel}>撤销</div>
    </div>
  );
};

export default Record;
