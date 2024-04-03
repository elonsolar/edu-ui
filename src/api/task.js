import request from '@/utils/request'

const api = {
  task: '/task'
}

export default api

export function listTask (parameter) {
  return request({
    url: api.task + '/page',
    method: 'get',
    params: parameter
  })
}

export function getTask (id) {
  return request({
    url: api.task + '/' + id,
    method: 'get'
  })
}

export function createTask (parameter) {
  return request({
    url: api.task,
    method: 'post',
    data: parameter
  })
}

export function updateTask (id, parameter) {
  return request({
    url: api.task + '/' + id,
    method: 'put',
    data: parameter
  })
}

export function deleteTask (parameter) {
  return request({
    url: api.task,
    method: 'delete',
    data: parameter
  })
}
