import React from "react";
import styles from './index.less'

interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

const DescriptionItem = (props: DescriptionItemProps) => {

  const {title, content} = props

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>{title}:</p>
      {content}
    </div>
  )
};

export default DescriptionItem
