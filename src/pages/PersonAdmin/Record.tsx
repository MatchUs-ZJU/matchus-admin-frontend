import React from 'react';
import styles from './index.less';

const Record = ({ sum, updateTime }) => {
  return (
    <div className={styles.record}>
      <div className={styles.recordinfo}>
        <div className={styles.value}>
          <div className={styles.change}>+2</div>
          <div className={styles.total}>{sum}</div>
        </div>
        <div className={styles.reason}>
          <div className={styles.description}>完善个人信息</div>
          <div className={styles.time}>{updateTime}</div>
        </div>
      </div>
      <div className={styles.cancel}>撤销</div>
    </div>
  );
};

export default Record;
