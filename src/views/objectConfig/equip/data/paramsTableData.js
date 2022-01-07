export const columns = [
    {
        title: '序号',
        dataIndex: 'num',
        customRender: (text, record, index) => `${index + 1}`,
    },
    {
        title: '参数缺省值',
        dataIndex: 'default',
    },
    {
        title: '超限上限值',
        dataIndex: 'max',
    },
    {
        title: '超限下限值',
        dataIndex: 'min',
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
]
export const tableData = [
    {
        key: '1',
        default: '32',
        max: '50',
        min: '22',
    },
]