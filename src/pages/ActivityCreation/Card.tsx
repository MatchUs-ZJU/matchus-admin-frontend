import React from 'react';
import styles from './index.less';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const Card = () => {
  return (
    <div>
      <div className={styles.card}>
        <div className={styles.top}>
          <div className={styles.alert}>已完成</div>
          <div>
            第 <b>2</b> 期
          </div>
        </div>
        <div className={styles.time}>
          <div>活动时间</div>
          <div className={styles.date}>6.05 - 6.14</div>
        </div>
        <div className={styles.iconcontainer}>
          <DeleteOutlined />
          <EditOutlined />
        </div>
      </div>
    </div>
  );
};

export default Card;
