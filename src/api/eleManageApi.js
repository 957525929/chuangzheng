import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'

export const getChilds = params => getAction('/programmerweb/ProgrammerResController/getChilds', params)

// export const getResByPathNodeId = params =>
//   getAction('/programmerweb/ProgrammerResController/getResByPathNodeId', params)

export const upload = params => postAction('/common/FileUploadController/upload', params)
export const addImg = params => postAction('/programmerweb/ProgrammerResController/addImg', params)
export const updateImg = params => postAction('/programmerweb/ProgrammerResController/updateImg', params)

export const addResHtml = params => postAction('/programmerweb/ProgrammerResController/addResHtml', params)
export const getHtmlContentByResId = params =>
  getAction('/programmerweb/ProgrammerResController/getHtmlContentByResId', params)
export const updateResHtml = params => postAction('/programmerweb/ProgrammerResController/updateResHtml', params)

export const delResource = params => postAction('/programmerweb/ProgrammerResController/deleteResource', params)
export const getResourceList = params => getAction('/programmerweb/ProgrammerResController/getResourceList', params)
