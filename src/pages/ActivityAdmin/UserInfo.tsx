import { Col, Divider, Drawer, message, Row } from "antd";
import { ActivityItem, FacultyItem } from "@/pages/data";
import { MatchResultItem } from "@/pages/ActivityAdmin/data";
import { useRequest } from "@@/plugin-request/request";
import { PageLoading } from "@ant-design/pro-components";
import { getUserMatchInfo } from "@/services/activity";
import { getPersonalInfo } from "@/services/users";
import DescriptionItem from "@/components/DescriptionItem";
import { getGenderText, getUserTypeText } from "@/utils/format";

interface MatchDetailProps {
  id: string
  visible: boolean
  faculties: FacultyItem[] | undefined
  onClose: ((e: any) => void) | undefined
}

const UserInfo = (props: MatchDetailProps) => {

  const { visible, onClose, id, faculties } = props

  const columnAttrList = [
    { column: '生日', dataIndex: 'birth' },
    { column: '家乡', dataIndex: 'hometown' },
    { column: '身高', dataIndex: 'height' },
    { column: '体重', dataIndex: 'weight' },
    { column: '体型', dataIndex: 'physique' },
    { column: '手机号', dataIndex: 'phoneNumber' },
    { column: '微信号', dataIndex: 'wechatNumber' },
    { column: '校区', dataIndex: 'currentSchoolCampus' },
    { column: '学历', dataIndex: 'currentSchoolStatus' },
    { column: '年级', dataIndex: 'currentSchoolGrade' },
    { column: '行业', dataIndex: 'industry' },
    { column: '是否九月毕业', dataIndex: 'schoolGraduateInSep' },
    { column: '在校生：一年内状态', dataIndex: 'oneYearStatus' },
    { column: '在校生：未来发展地', dataIndex: 'futureBase' },
    { column: '在校生：自选未来发展地', dataIndex: 'selfFutureBase' },
    { column: '气质外表', dataIndex: 'temperament' },
    { column: '兴趣爱好', dataIndex: 'interest' },
    { column: '熬夜频率', dataIndex: 'stayUpFrequency' },
    { column: '运动频率', dataIndex: 'exerciseFrequency' },
    { column: '抽烟习惯', dataIndex: 'smokingHabit' },
    { column: '蹦迪习惯', dataIndex: 'discoHabit' },
    { column: '饮酒习惯', dataIndex: 'drinkHabit' },
    { column: '参与意愿', dataIndex: 'willingness' },
    { column: '恋爱次数', dataIndex: 'loveHistory' },
    { column: '在校生：消费水平', dataIndex: 'consumption' },
    { column: '在校生：消费分担', dataIndex: 'consumptionShare' },
    { column: 'MBTI', dataIndex: 'mbti' },
    { column: '校友：学历', dataIndex: 'graduateEducation' },
    { column: '校友：工作地点', dataIndex: 'graduateWorkLocation' },
    { column: '校友：工作收入', dataIndex: 'graduateIncome' },
    { column: '校友：工作岗位', dataIndex: 'graduateWorkDetail' },
  ];

  // FETCH 用户个人信息
  const { loading, error, data: currentRow } =
    useRequest(() => {
      return getPersonalInfo({ id:id as unknown as number })
    }, {
      formatResult: res => res?.data.records[0],
      ready: visible,
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
        <PageLoading />
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
        currentRow && (
          <>
            <Row>
              <Col span={12}>
                <DescriptionItem title="姓名" content={currentRow?.realname} />
              </Col>
              <Col span={12}>
                <DescriptionItem title="学号" content={currentRow?.studentNumber} />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="性别" content={getGenderText(currentRow?.gender)} />
              </Col>
              {/*<Col span={12}>*/}
              {/*  <DescriptionItem title="生日" content={currentRow?.birth} />*/}
              {/*</Col>*/}
              <Col span={12}>
                <DescriptionItem
                  title="院系"
                  content={faculties?.[(currentRow?.faculty as number) - 1]?.name}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="用户类型" content={getUserTypeText(currentRow?.userType)} />
              </Col>
            </Row>

            {columnAttrList.map((_, index) => {
              if (getUserTypeText(currentRow?.userType) == '在校生') {
                if (index % 2 == 0 && index < 27) {
                  return (
                    <Row>
                      <Col span={12}>
                        <DescriptionItem
                          title={columnAttrList[index].column}
                          content={currentRow?.[columnAttrList[index].dataIndex] ?? '-'}
                        />
                      </Col>
                      {index !== columnAttrList.length - 1 && (
                        <Col span={12}>
                          <DescriptionItem
                            title={columnAttrList[index + 1].column}
                            content={currentRow?.[columnAttrList[index + 1].dataIndex]}
                          />
                        </Col>
                      )}
                    </Row>
                  );
                } else {
                  return <></>;
                }
              } else if (getUserTypeText(currentRow?.userType) == '校友') {
                if (index % 2 == 0 && index < 31) {
                  return (
                    <Row>
                      <Col span={12}>
                        <DescriptionItem
                          title={columnAttrList[index].column}
                          content={currentRow?.[columnAttrList[index].dataIndex] ?? '-'}
                        />
                      </Col>
                      {index !== columnAttrList.length - 1 && (
                        <Col span={12}>
                          <DescriptionItem
                            title={columnAttrList[index + 1].column}
                            content={currentRow?.[columnAttrList[index + 1].dataIndex]}
                          />
                        </Col>
                      )}
                    </Row>
                  );
                } else {
                  return <></>;
                }
              }
            })}
          </>
        )
      }
    </Drawer>
  )

}

export default UserInfo
