import {Col, Divider, Drawer, message, Row} from "antd";
import {ActivityItem} from "@/pages/data";
import {MatchResultItem} from "@/pages/ActivityAdmin/data";
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

const DailyQuestions = (props: DailyQuestionsProps) => {

  const {visible = false, onClose, values, activity} = props
  // FETCH 用户个人信息
  const {loading, error, data: dailyQuestions} =
    useRequest(() => {
      return getUserMatchInfo({activityId: activity?.id as number, studentNumber: values?.studentNumber as string})
    }, {
      formatResult: res => res?.data.dailyQuestion
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
        <Col span={10}>{values?.name}</Col>
        <Col span={10}>{values?.success?.matchName}</Col>
      </Row>
      <Divider/>
      {
        dailyQuestions ?
          dailyQuestions.map((dailyQuestion) => {
            return (
              <Row justify="space-between" align="middle">
                <Col span={10}>
                  <Row
                    style={{fontSize: '14px', lineHeight: '24px', fontWeight: 'bold'}}>Day {dailyQuestion.index}</Row>
                  <Row style={{fontSize: '14px', lineHeight: '24px'}}>Ta的提问: {dailyQuestion.matchQuestion}</Row>
                  <Row style={{fontSize: '14px', lineHeight: '24px'}}>我的回答: {dailyQuestion.answer}</Row>
                  {
                    dailyQuestion.matchLike ? <LikeFilled style={{color: '#918AE3', fontSize: '24px', position: "absolute", right: '8px', bottom: '0px'}}/>
                      : <LikeOutlined style={{fontSize: '24px', position: "absolute", right: '8px', bottom: '0px'}}/>
                  }
                </Col>
                <Col span={10}>
                  <Row
                    style={{fontSize: '14px', lineHeight: '24px', fontWeight: 'bold'}}>Day {dailyQuestion.index}</Row>
                  <Row style={{fontSize: '14px', lineHeight: '24px'}}>我的提问: {dailyQuestion.question}</Row>
                  <Row style={{fontSize: '14px', lineHeight: '24px'}}>Ta的回答: {dailyQuestion.matchAnswer}</Row>
                  {
                    dailyQuestion.like ? <LikeFilled style={{color: '#918AE3', fontSize: '24px', position: "absolute", right: '8px', bottom: '0px'}}/>
                      : <LikeOutlined style={{fontSize: '24px', position: "absolute", right: '8px', bottom: '0px'}}/>
                  }
                </Col>
                <Divider/>
              </Row>
              // <>
              //   <Row style={{
              //     fontSize: '15px',
              //     lineHeight: '24px',
              //     fontWeight: 'bold',
              //     paddingBottom: '8px'
              //   }}>{fields.name}</Row>
              //   {
              //     fields.fields.map((field) => {
              //       return (
              //         <>
              //           <Row style={{fontSize: '14px', lineHeight: '24px'}}>{field.key}</Row>
              //           <Row style={{
              //             fontSize: '14px',
              //             lineHeight: '24px',
              //             color: 'rgba(0, 0, 0, 0.5)'
              //           }}>{field.value}</Row>
              //         </>
              //       )
              //     })
              //   }
              //   <Divider/>
              // </>
            )
          }) :
          <></>
      }
    </Drawer>
  )

}

export default DailyQuestions
