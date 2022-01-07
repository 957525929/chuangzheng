export const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '账号',
    dataIndex: 'account',
    scopedSlots: { customRender: 'account' }
  },
  {
    title: '姓名',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '工号',
    dataIndex: 'workId',
    scopedSlots: { customRender: 'workId' }
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    scopedSlots: { customRender: 'phone' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' }
  },
  {
    title: '修改资源',
    dataIndex: 'hasRight',
    scopedSlots: { customRender: 'hasRight' }
  },
  {
    title: '禁启用',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export const tableData = []
