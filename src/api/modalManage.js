import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'

export const delTemplate = params => deleteAction('/template/' + params)

export const addTemplate = params => postAction('/template/addTemplate', params)

export const pageTemplate = params => getAction('/template/paging', params)

export const updateTemplate = params => putAction('/template/updateTemplate', params)

export const upload = params => postAction('/template/upload', params)

export const getSysDataDict = params => getAction('/programmerweb/ProgrammerResController/getSysDataDict', params)



