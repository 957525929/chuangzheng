export const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    // customRender: (text, record, index) => `${index + 1}`
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '仪器类型',
    dataIndex: 'actType',
    scopedSlots: { customRender: 'actType' }
  },

  {
    title: '更新时间',
    dataIndex: 'updateTime',
    scopedSlots: { customRender: 'updateTime' }
  },
  {
    title: '描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export const tableData = [
  // {
  //   key: '1',
  //   name: '全站仪',
  //   eName: 'total station',
  //   type: '移动监测仪器',
  //   time: '2021-10-20 14:33:41'
  // },
  // {
  //   key: '2',
  //   name: '水准仪',
  //   type: '移动监测仪器',
  //   eName: 'Level',
  //   time: '2021-10-20 14:34:57'
  // }
]
