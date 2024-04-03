/* eslint-disable */ 
import request from '@/utils/request'

const api = {
  coursePlan: '/course-plan',
  coursePlanDetail: '/course-plan-detail',
  coursePlanStudent:'/course-plan-student',
  dailyLesson:'/daily-lesson',
  dailyLessonStudent:'/daily-lesson-student'
}

export default api

export function listCoursePlan (parameter) {
  return request({
    url: api.coursePlan + '/page',
    method: 'get',
    params: parameter
  })
}

export function getCoursePlan (id) {
  return request({
    url: api.coursePlan + '/' + id,
    method: 'get'
  })
}

export function createCoursePlan (parameter) {
  return request({
    url: api.coursePlan,
    method: 'post',
    data: parameter
  })
}

export function updateCoursePlan (id, parameter) {
  return request({
    url: api.coursePlan + '/' + id,
    method: 'put',
    data: parameter
  })
}

export function releaseCoursePlan (parameter) {
  return request({
    url: api.coursePlan + '/release',
    method: 'post',
    data: parameter
  })
}

export function sheduleDateForCoursePlan (parameter) {
  return request({
    url: api.coursePlan + '/shedule-date',
    method: 'post',
    data: parameter
  })
}

export function createCoursePlanDetail (parameter) {
  return request({
    url: api.coursePlanDetail,
    method: 'post',
    data: parameter
  })
}

export function updateCoursePlanDetail (id, parameter) {
  return request({
    url: api.coursePlanDetail + '/' + id,
    method: 'put',
    data: parameter
  })
}
export function listCoursePlanDetail ( parameter) {
  return request({
    url: api.coursePlanDetail + '/list-all' ,
    method: 'get',
    params: parameter
  })
}

export function deleteCoursePlanDetail ( id) {
  return request({
    url: api.coursePlanDetail + '/'+id,
    method: 'delete',
  })
}

export function batchAddCoursePlanDetail ( data) {
  return request({
    url: api.coursePlanDetail + '/batch-add',
    method: 'post',
    data:data
  })
}


export function listCoursePlanDetailWithPage ( parameter) {
  return request({
    url: api.coursePlanDetail + '/page' ,
    method: 'get',
    params: parameter
  })
}

export function stopCoursePlanDetail ( parameter) {
  return request({
    url: api.coursePlanDetail + '/stop' ,
    method: 'post',
    data: parameter
  })
}

export function scheduleDateForCoursePlanDetail (parameter) {
  return request({
    url: api.coursePlanDetail + '/schedule',
    method: 'post',
    data: parameter
  })
}





export function listCoursePlanStudent (parameter) {
  return request({
    url: api.coursePlanStudent + '/page',
    method: 'get',
    params: parameter
  })
}

export function getCoursePlanStudent (id) {
  return request({
    url: api.coursePlanStudent + '/' + id,
    method: 'get'
  })
}

export function createCoursePlanStudent (parameter) {
  return request({
    url: api.coursePlanStudent,
    method: 'post',
    data: parameter
  })
}

export function updateCoursePlanStudent (id, parameter) {
  return request({
    url: api.coursePlanStudent + '/' + id,
    method: 'put',
    data: parameter
  })
}

export function stopCoursePlanStudent ( parameter) {
  return request({
    url: api.coursePlanStudent + '/stop' ,
    method: 'post',
    data: parameter
  })
}
// 
export function listDailyLesson (parameter) {
  return request({
    url: api.dailyLesson + '/page',
    method: 'get',
    params: parameter
  })
}

export function getDailyLesson (id) {
  return request({
    url: api.dailyLesson + '/' + id,
    method: 'get'
  })
}

export function createDailyLesson (parameter) {
  return request({
    url: api.dailyLesson,
    method: 'post',
    data: parameter
  })
}

export function updateDailyLesson (id, parameter) {
  return request({
    url: api.dailyLesson + '/' + id,
    method: 'put',
    data: parameter
  })
}

export function startDailyLesson ( parameter) {
  return request({
    url: api.dailyLesson + '/start',
    method: 'post',
    data: parameter
  })
}

export function cancelDailyLesson ( parameter) {
  return request({
    url: api.dailyLesson + '/cancel',
    method: 'post',
    data: parameter
  })
}

export function finishDailyLesson ( parameter) {
  return request({
    url: api.dailyLesson + '/finish',
    method: 'post',
    data: parameter
  })
}



export function listDailyLessonStudent (parameter) {
  return request({
    url: api.dailyLessonStudent + '/page',
    method: 'get',
    params: parameter
  })
}

export function signDailyLessonStudent (parameter) {
  return request({
    url: api.dailyLessonStudent + '/sign',
    method: 'post',
    data: parameter
  })
}

export function leaveDailyLessonStudent (parameter) {
  return request({
    url: api.dailyLessonStudent + '/leave',
    method: 'post',
    data: parameter
  })
}