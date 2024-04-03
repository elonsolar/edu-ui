/* eslint-disable */ 
import request from '@/utils/request'

const api = {
  customer: '/customer'
}

export default api

export function listCustomer (parameter) {
  return request({
    url: api.customer + '/page',
    method: 'get',
    params: parameter
  })
}

export function getCustomer (id) {
  return request({
    url: api.customer + '/' + id,
    method: 'get'
  })
}

export function createCustomer (parameter) {
  return request({
    url: api.customer,
    method: 'post',
    data: parameter
  })
}

export function updateCustomer (id, parameter) {
  return request({
    url: api.customer + '/' + id,
    method: 'put',
    data: parameter
  })
}

export function adjustLessonNumber(parameter){
  return request({
    url: api.customer + '/lesson/adjust',
    method: 'post',
    data: parameter
  })
}

export function listLessonHistory(parameter){
  return request({
    url: api.customer + '/lesson/history',
    method: 'get',
    params: parameter
  })
}