import request from '@/utils/request'

const api = {
  student: '/student'
}

export default api

export function listStudent (parameter) {
  return request({
    url: api.student + '/page',
    method: 'get',
    params: parameter
  })
}

export function getStudent (id) {
  return request({
    url: api.student + '/' + id,
    method: 'get'
  })
}

export function createStudent (parameter) {
  return request({
    url: api.student,
    method: 'post',
    data: parameter
  })
}

export function updateStudent (id, parameter) {
  return request({
    url: api.student + '/' + id,
    method: 'put',
    data: parameter
  })
}
