import { Divider, Drawer, message, Row } from "antd";
import { ActivityItem } from "@/pages/data";
import { MatchResultItem } from "@/pages/ActivityAdmin/data";
import { useRequest } from "@@/plugin-request/request";
import { PageLoading } from "@ant-design/pro-components";
import { getFeedbackInfo } from '@/services/activity'
import styles from './index.less'

interface DailyFeedbackProps {
  activity: ActivityItem | undefined
  values: MatchResultItem | undefined
  visible: boolean
  onClose: ((e: any) => void) | undefined
}

const DailyFeedback = (props: DailyFeedbackProps) => {
  const { visible = false, onClose, values, activity } = props

  // FETCH 用户个人信息
  const { loading, error } =
    useRequest(() => {
      return getFeedbackInfo(activity?.id as number, Number(values?.id))
    })
  if (error) {
    message.error('获取每日反馈信息信息失败')
  }

  if (loading) {
    return (
      <Drawer
        title='每日反馈详情'
        width={800}
        visible={visible && loading && !error}
        onClose={onClose}
      >
        <PageLoading />
      </Drawer>
    )
  }

  return (
    <Drawer
      title='每日反馈详情'
      width={700}
      onClose={onClose}
      visible={visible}
    >
      <div className={styles.usernameContainer}><div className={styles.username}>{values?.name}</div></div>
    </Drawer>
  )
}


export default DailyFeedback


// 【{ values?.name }】


