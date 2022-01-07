import { getAction, postAction } from '@/api/manage'

export const activityApi = {
  //获取方法详情
  getMethodDetail: (params) => {
    return getAction('/programmerweb/MethodController/getMethodDetail', params)
  },
  //获取活动信息
  getActivity: (params) => {
    return getAction('programmerweb/ActivityController/getActivity', params)
  },
  //新增活动
  addActivity: (params) => {
    return postAction('/programmerweb/ActivityController/addActivity', params)
  },
  //新增活动开始结束点
  addStartEndActivity: (params) => {
    return postAction('/programmerweb/ActivityController/addStartEndActivity', params)
  },
  //删除活动
  deleteActivity: (params) => {
    return postAction('/programmerweb/ActivityController/deleteActivity', params)
  },
  //根据方法id获取活动列表
  getActivityList: (params) => {
    return getAction('/programmerweb/ActivityController/getActivityList', params)
  },
  //更新活动
  updateActivity: (params) => {
    return postAction('/programmerweb/ActivityController/updateActivity', params)
  },
  //更新活动间关系
  updateMethodActs: (params) => {
    return  postAction('/programmerweb/ActivityController/updateMethodActs', params)
  },
  //获取所有活动列表
  getAllActivities: () => {
    return  getAction('/programmerweb/ActivityController/getAllActivities')
  },
  //根据活动ID获取pathNodeId
  getPathNodeIdByActivityId: (params) => {
    return  getAction('programmerweb/ActivityController/getPathNodeIdByActivityId', params)
  }
}
