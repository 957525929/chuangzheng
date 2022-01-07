export const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    customRender: (text, record, index) => `${index + 1}`
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '英文名称',
    dataIndex: 'eName'
  },
  {
    title: '更新时间',
    dataIndex: 'time'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export const tableData = [
  {
    key: '1',
    name: '尺垫',
    eName: 'instrument',
    time: '2021-10-20 14:33:41'
  },
  {
    key: '2',
    name: '三脚架',
    eName: 'tripod',
    time: '2021-10-20 14:34:57'
  }
]
