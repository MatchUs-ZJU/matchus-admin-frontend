import {Divider, Drawer, message, Row} from "antd";
import {ActivityItem} from "@/pages/data";
import {MatchResultItem} from "@/pages/ActivityAdmin/data";
import {useRequest} from "@@/plugin-request/request";
import {PageLoading} from "@ant-design/pro-components";
import {getUserMatchInfo} from "@/services/activity";

interface MatchDetailProps {
  activity: ActivityItem | undefined
  values: MatchResultItem | undefined
  visible: boolean
  onClose: ((e: any) => void) | undefined
}

const MatchDetail = (props: MatchDetailProps) => {

  const {visible = false, onClose, values, activity} = props

  // FETCH 用户个人信息
  const {loading, error, data: userInfo} =
    useRequest(() => {
      return getUserMatchInfo({activityId: activity?.id as number, studentNumber: values?.studentNumber as string})
    }, {
      formatResult: res => res?.data.matchInfo.info
    })

  if (error) {
    message.error('获取用户匹配信息失败')
  }

  if (loading) {
    return (
      <Drawer
        title='匹配信息详情'
        width={400}
        visible={visible && loading && !error}
      >
        <PageLoading/>
      </Drawer>
    )
  }

  return (
    <Drawer
      title='匹配信息详情'
      width={400}
      onClose={onClose}
      visible={visible}
    >
      {
        userInfo ?
          userInfo.map((fields) => {
            return (
              <>
                <Row style={{
                  fontSize: '15px',
                  lineHeight: '24px',
                  fontWeight: 'bold',
                  paddingBottom: '8px'
                }}>{fields.name}</Row>
                {
                  fields.fields.map((field) => {
                    return (
                      <>
                        <Row style={{fontSize: '14px', lineHeight: '24px'}}>{field.key}</Row>
                        <Row style={{
                          fontSize: '14px',
                          lineHeight: '24px',
                          color: 'rgba(0, 0, 0, 0.5)'
                        }}>{field.value}</Row>
                      </>
                    )
                  })
                }
                <Divider/>
              </>
            )
          }) :
          <></>
      }
    </Drawer>
  )

}

export default MatchDetail
