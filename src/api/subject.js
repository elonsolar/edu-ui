import request from '@/utils/request'

const api = {
  subject: '/subject'
}

export default api

export function listSubject (parameter) {
  return request({
    url: api.subject + '/page',
    method: 'get',
    params: parameter
  })
}

export function getSubject (id) {
  return request({
    url: api.subject + '/' + id,
    method: 'get'
  })
}

export function createSubject (parameter) {
  return request({
    url: api.subject,
    method: 'post',
    data: parameter
  })
}

export function updateSubject (id, parameter) {
  return request({
    url: api.subject + '/' + id,
    method: 'put',
    data: parameter
  })
}
