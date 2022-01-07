import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'

export const sight = {
  //获取特殊情景
  sceneSight: params => {
    return getAction('/programmerweb/sceneSight', params)
  },
  //新增
  addsceneSight: params => {
    console.log('paramsparamsparams', params)
    return postAction('/programmerweb/sceneSight', params)
  },
  //更新
  updatesceneSight: params => {
    return putAction('/programmerweb/sceneSight', params)
  },
  //删除
  deletesceneSight: params => {
    return deleteAction('/programmerweb/sceneSight/' + params)
  }
}
