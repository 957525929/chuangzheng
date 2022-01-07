import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'

export const cardApi = {
  //获取方法详情
  paging: params => {
    return getAction('/explain/paging', params)
  },
  //新增
  addCard: params => {
    return postAction('/explain/addExplain', params)
  },
  //更新基础知识
  updateCard: params => {
    return putAction('/explain/updateExplain', params)
  },
  //删除
  deleteCard: params => {
    return deleteAction('/explain/' + params)
  },
  //根据场景条目查询所有条目
  loadCard: params => {
    return getAction('/card/ranks/' + params)
  },
  //添加卡片条目
  addRows: params => {
    return postAction('/card/ranks/addRows', params)
  },
  //更新场景条目
  updateCardRow: params => {
    return putAction('/card/ranks/updateCardRow', params)
  },
  //删除场景条目
  deleteCardRow: params => {
    return deleteAction('/card/ranks/' + params)
  }
}
