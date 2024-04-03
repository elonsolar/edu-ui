import request from '@/utils/request'

const api = {
  teacher: '/teacher'
}

export default api

export function listTeacher (parameter) {
  return request({
    url: api.teacher + '/page',
    method: 'get',
    params: parameter
  })
}

export function getTeacher (id) {
  return request({
    url: api.teacher + '/' + id,
    method: 'get'
  })
}

export function createTeacher (parameter) {
  return request({
    url: api.teacher,
    method: 'post',
    data: parameter
  })
}

export function updateTeacher (id, parameter) {
  return request({
    url: api.teacher + '/' + id,
    method: 'put',
    data: parameter
  })
}
