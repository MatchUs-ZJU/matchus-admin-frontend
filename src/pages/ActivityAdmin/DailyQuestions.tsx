import {Col, Divider, Drawer, message, Row} from "antd";
import type {ActivityItem, DailyQuestion} from "@/pages/data";
import type {MatchResultItem} from "@/pages/ActivityAdmin/data";
import {useRequest} from "@@/plugin-request/request";
import {PageLoading} from "@ant-design/pro-components";
import {getUserMatchInfo} from "@/services/activity";
import {LikeFilled, LikeOutlined} from "@ant-design/icons";

interface DailyQuestionsProps {
  activity: ActivityItem | undefined
  values: MatchResultItem | undefined
  visible: boolean
  onClose: ((e: any) => void) | undefined
}

type DailyData = {
  user: DailyQuestion,
  matchUser: DailyQuestion
}

const DailyQuestions = (props: DailyQuestionsProps) => {
  const {visible = false, onClose, values, activity} = props

  // FETCH 用户个人信息
  const {loading, error, data: dailyQuestion} =
    useRequest(() => {
      return getUserMatchInfo({activityId: activity?.id as number, studentNumber: values?.studentNumber as string})
    }, {
      formatResult: res => res?.data.dailyQuestion,
      ready: visible
    })

  if (error) {
    message.error('获取每日一问信息信息失败')
  }

  if (loading) {
    return (
      <Drawer
        title='每日一问详情'
        width={800}
        visible={visible && loading && !error}
        onClose={onClose}
      >
        <PageLoading/>
      </Drawer>
    )
  }

  // 处理拿到的每日一问数据
  const user = dailyQuestion?.user.sort((o1, o2) => o1.index - o2.index)
  const matchUser = dailyQuestion?.matchUser.sort((o1, o2) => o1.index - o2.index)
  let data: DailyData[] = []
  if (user && matchUser) {
    data = new Array<DailyData>(Math.max(matchUser.length, user.length))
    for (let i = 0; i < data.length; i++) {
      data[i] = {
        user: user[i],
        matchUser: matchUser[i]
      }
    }
  }

  return (
    <Drawer
      title='每日一问详情'
      width={700}
      onClose={onClose}
      visible={visible}
    >
      <Row justify="space-between" align="middle"
           style={{
             fontSize: '15px',
             lineHeight: '24px',
             fontWeight: 'bold',
           }}
      >
        <Col span={10}>我：{values?.name}</Col>
        <Col span={10}>Ta：{values?.matchName}</Col>
      </Row>
      <Divider/>
      {
        data ?
          data.map((value) => {
            return (
              <Row justify="space-between" align="middle">
                <Col span={10}>
                  <Row
                    style={{fontSize: '14px', lineHeight: '24px', fontWeight: 'bold'}}>Day {value.user?.index}</Row>
                  <Row style={{fontSize: '14px', lineHeight: '24px'}}>Ta的提问: {value.user?.question}</Row>
                  <Row style={{fontSize: '14px', lineHeight: '24px'}}>我的回答: {value.user?.answer}</Row>
                  {
                    value.user?.like ? <LikeFilled
                        style={{color: '#918AE3', fontSize: '24px', position: "absolute", right: '8px', bottom: '0px'}}/>
                      : <LikeOutlined style={{fontSize: '24px', position: "absolute", right: '8px', bottom: '0px'}}/>
                  }
                </Col>
                <Col span={10}>
                  <Row
                    style={{fontSize: '14px', lineHeight: '24px', fontWeight: 'bold'}}>Day {value.matchUser?.index}</Row>
                  <Row style={{fontSize: '14px', lineHeight: '24px'}}>我的提问: {value.matchUser?.question}</Row>
                  <Row style={{fontSize: '14px', lineHeight: '24px'}}>Ta的回答: {value.matchUser?.answer}</Row>
                  {
                    value.matchUser?.like ? <LikeFilled
                        style={{color: '#918AE3', fontSize: '24px', position: "absolute", right: '8px', bottom: '0px'}}/>
                      : <LikeOutlined style={{fontSize: '24px', position: "absolute", right: '8px', bottom: '0px'}}/>
                  }
                </Col>
                <Divider/>
              </Row>
            )
          }) :
          <></>
      }
    </Drawer>
  )

}

export default DailyQuestions
