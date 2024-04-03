import request from '@/utils/request'

const api = {
  room: '/room'
}

export default api

export function listRoom (parameter) {
  return request({
    url: api.room + '/page',
    method: 'get',
    params: parameter
  })
}

export function getRoom (id) {
  return request({
    url: api.room + '/' + id,
    method: 'get'
  })
}

export function createRoom (parameter) {
  return request({
    url: api.room,
    method: 'post',
    data: parameter
  })
}

export function updateRoom (id, parameter) {
  return request({
    url: api.room + '/' + id,
    method: 'put',
    data: parameter
  })
}
