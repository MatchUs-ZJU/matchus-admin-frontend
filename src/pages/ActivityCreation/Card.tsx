import React from 'react';
import styles from './index.less';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const Card = ({ activity, editActivity }) => {
  return (
    <div>
      <div className={styles.card}>
        <div className={styles.top}>
          {/* <div className={styles.alert}>已完成</div> */}
          <div>
            第 <b>{activity.term}</b> 期
          </div>
        </div>
        <div className={styles.time}>
          <div>活动时间</div>
          <div className={styles.date}>
            {activity.startDate} ~ <br />
            {activity.endDate}
          </div>
        </div>
        <div className={styles.iconcontainer}>
          {/*<DeleteOutlined className={styles.icon} onClick={() => handleDeleteActivity(term)} />*/}
          <EditOutlined className={styles.icon} onClick={() => {editActivity(activity)}}/>
        </div>
      </div>
    </div>
  );
};

export default Card;
