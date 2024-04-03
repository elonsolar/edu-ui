<template>
  <a-modal
    :title="title"
    :width="840"
    :visible="visible"
    :confirmLoading="loading"
    @ok="submit"
    @cancel="cancel"
  >
    <a-spin :spinning="loading">
        <a-form-model
         ref="planForm"
        :model="form"
        :rules="rules"
        layout='vertical'
        >
        <a-row :gutter="16">
          <a-col span="12">
            <a-form-model-item label="所属计划" prop="planName">
              <a-select
                show-search
                :value="form.planId"
                placeholder="输入计划名称"
                style="width: 300px"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handlePlanSearch"
                @change="handlePlanChange"
              >
              <a-select-option v-for="d in planList" :key="d.id" :name="d.name" :cycleType="d.cycleType">
                {{ d.name }}
              </a-select-option>
            </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item label="日期" prop="planName">
              <a-select
                show-search
                :value="form.dayIndex"
                placeholder="请选择日期"
                style="width: 300px"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @change="handleDayIndexChange"
              >
              <a-select-option v-for="d in dayIndexList" :key="d.code" :name="d.name">
                {{ d.name }}
              </a-select-option>
            </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
          <a-row :gutter="16">
          <a-col span="12">
            <a-form-model-item label="开始时间" prop="cycleType">
              <a-time-picker style="width: 300px" :default-value="moment(this.form.startTime||'24:00', 'HH:mm')||null" @change="(m,s)=>handleTimeChange(s,'startTime')" format="HH:mm" />
            </a-form-model-item>
        </a-col>
        <a-col span="12">
            <a-form-model-item label="结束时间" prop="cycleType">
              <a-time-picker style="width: 300px" :default-value="moment(this.form.endTime||'24:00', 'HH:mm')||null" @change="(m,s)=>handleTimeChange(s,'endTime')" format="HH:mm" />
            </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
          <a-col span="12">
            <a-form-model-item label="教室" >
              <a-select
                show-search
                :value="form.roomId"
                placeholder="输入教室名称"
                style="width: 300px"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleRoomSearch"
                @change="handleRoomChange"
              >
              <a-select-option v-for="d in roomList" :key="d.id" :name="d.code">
                {{ d.code }}
              </a-select-option>
            </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item label="科目" >
              <a-select
                show-search
                :value="form.subjectId"
                placeholder="输入科目名称"
                style="width: 300px"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSubjectSearch"
                @change="handleSubjectChange"
              >
              <a-select-option v-for="d in subjectList" :key="d.id" :name="d.name">
                {{ d.name }}
              </a-select-option>
            </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      <a-row :gutter="16">
        <a-col span="12">
            <a-form-model-item label="老师" >
              <a-select
                show-search
                :value="form.teacherId"
                placeholder="输入老师名称"
                style="width: 300px"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleTeacherSearch"
                @change="handleTeacherChange"
              >
              <a-select-option v-for="d in teacherList" :key="d.id" :name="d.name">
                {{ d.name }}
              </a-select-option>
            </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item label="年级" prop="description">
              <a-input style="width: 80%" auto-size v-model="form.gradeName" />
            </a-form-model-item>
          </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col span="12">
          <a-form-model-item label="课时数" prop="description">
              <a-input-number :min="1" :max="10" style="width: 80%" auto-size v-model="form.lessonNum" />
            </a-form-model-item>
        </a-col>
        <a-col span="12">
          <a-form-model-item label="计划人数" prop="description">
              <a-input-number :min="1" :max="10" style="width: 80%" auto-size v-model="form.planNum" />
            </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
/* eslint-disable */ 
import pick from 'lodash.pick'
import moment from 'moment'
import {  listCoursePlan, createCoursePlanDetail, updateCoursePlanDetail } from '@/api/coursePlan'
import {  listRoom} from '@/api/room'
import {  listSubject} from '@/api/subject'
import {  listTeacher} from '@/api/teacher'

import { filterEmpty } from '@/components/_util/util'
// 表单字段

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => '新增'
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      moment:moment,
      planList:[],
      dayIndexList:[],
      roomList:[],
      subjectList:[],
      teacherList:[],

      form: {
        "id":undefined,
        "planId":undefined,
        "planName":undefined,
        "dayIndex":undefined,
        "dayIndexName":undefined,
        "roomId":undefined,
        "roomName":undefined,
        "subjectId":undefined,
        "subjectName":undefined,
        "teacherId":undefined,
        "teacherName":undefined,
        "gradeName":undefined,
        "lessonNum":undefined,
        "planNum":undefined
      },
      rules: {
        planName: [
          { required: true, message: '请输入计划名称', trigger: 'blur' },
        ],
      },
      confirmLoading: false,
      excludeRulecolumns:[
      {
          title: '排除类型',
          dataIndex: 'excludeType',
          key: 'excludeType',
          width: '40%',
          scopedSlots: { customRender: 'excludeType' }
        },
        {
          title: '日期',
          dataIndex: 'excludeDate',
          key: 'excludeDate',
          width: '40%',
          scopedSlots: { customRender: 'excludeDate' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      excludeRuleData:[],
      subjectTimeTableColumn:[
        {
          title: '科目',
          dataIndex: 'subjectId',
          key: 'subjectId',
          width: '40%',
          scopedSlots: { customRender: 'subjectId' }
        },
        {
          title: '年级',
          dataIndex: 'gradeId',
          key: 'gradeId',
          width: '40%',
          scopedSlots: { customRender: 'gradeId' }
        },
        {
          title: '人数',
          dataIndex: 'studentNum',
          key: 'studentNum',
          width: '40%',
          scopedSlots: { customRender: 'studentNum' }
        },
        {
          title: '课程时间',
          dataIndex: 'studentNum',
          key: 'studentNum',
          width: '40%',
          scopedSlots: { customRender: 'studentNum' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  beforeCreate() {
  },
  created () {
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && (this.initForm())
    })
  },
  methods:{

    initForm(){
      this.form={...this.model,
        "courseTime":[this.model.startTime,this.model.endTime],
      }
      this.initPlan()
      this.handleRoomSearch()
      this.handleSubjectSearch()
      this.handleTeacherSearch()

    },
    async initPlan(){
      await this.handlePlanSearch()
      await this.initDayIndexList(this.model.planId)
    },
    resetForm(){
      this.form={
        "id":undefined,
        "planId":undefined,
        "planName":undefined,
        "dayIndex":undefined,
        "dayIndexName":undefined,
        "roomId":undefined,
        "roomName":undefined,
        "subjectId":undefined,
        "subjectName":undefined,
        "teacherId":undefined,
        "teacherName":undefined,
        "gradeName":undefined,
        "lessonNum":undefined,
        "planNum":undefined
      }
    },
    submit(){
      let that =this

      this.$refs.planForm.validate(valid => {
        if (valid) {
          if (that.form.id) {
            // 修改 e.g.
            updateCoursePlanDetail(that.form.id, that.form).then(res => {
              // 重置表单数据
              that.resetForm()
              this.$message.info('修改成功')
              this.$emit('ok') 
            })
          } else {
            // 新增
            createCoursePlanDetail(that.form).then(res => {
              // 重置表单数据
              that.resetForm()
              this.$message.info('新增成功')
              this.$emit('ok') 
            })
          }
        } else {
          
            console.log(this.$refs.planForm.getFieldsError())
            
        }
      })

    },
    cancel(){
      this.resetForm()
      this.$emit('cancel') 
    },
    handlePlanSearch(value) {
      
      var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'name',
            'value': value || null,
            'op': 'like'
          }
        ]
        }
        const newObj = { 'pageSize':999, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listCoursePlan(newObj)
          .then(res => {
            this.planList=res.data
          })
    },

    initDayIndexList(planId){

      let planList = this.planList.filter(plan=> plan.id==planId)
      if (planList.length==0){
        this.dayIndexList=[]
        return 
      }
      let cycleType=planList[0].cycleType

      // dayIndex
      if (cycleType=="0"){//日
        this.dayIndexList=[
          {
            "code":1,
            "name":"每天"
          }
        ]
      }else if (cycleType=="1"){// 周
        this.dayIndexList=[
          {
            "code":1,
            "name":"周一"
          },
          {
            "code":2,
            "name":"周二"
          },
          {
            "code":3,
            "name":"周三"
          },
          {
            "code":4,
            "name":"周四"
          },
          {
            "code":5,
            "name":"周五"
          },
          {
            "code":6,
            "name":"周六"
          },
          {
            "code":7,
            "name":"周日"
          }
        ]
     }


    },

    handlePlanChange(value,node) {
      console.log(value);
      this.form.planId = value;
      this.form.planName = node.data.attrs.name;
      this.initDayIndexList(value)

    },
    handleRoomSearch(value) {
      
      var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'code',
            'value': value || null,
            'op': 'like'
          }
        ]
        }
        const newObj = { 'pageSize':999, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listRoom(newObj)
          .then(res => {
            this.roomList=res.data
          })
    },
    handleRoomChange(value,node) {
      console.log(value);
      this.form.roomId = value;
      this.form.roomName = node.data.attrs.name;
    },
    handleSubjectSearch(value) {
      
      var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'name',
            'value': value || null,
            'op': 'like'
          }
        ]
        }
        const newObj = { 'pageSize':999, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listSubject(newObj)
          .then(res => {
            this.subjectList=res.data
          })
    },
    handleSubjectChange(value,node) {
      console.log(value);
      this.form.subjectId = value;
      this.form.subjectName = node.data.attrs.name;
    },
    handleTeacherSearch(value) {
      
      var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'name',
            'value': value || null,
            'op': 'like'
          }
        ]
        }
        const newObj = { 'pageSize':999, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listTeacher(newObj)
          .then(res => {
            this.teacherList=res.data
          })
    },
    handleTeacherChange(value,node) {
      console.log(value);
      this.form.teacherId = value;
      this.form.teacherName = node.data.attrs.name;
    },
    handleDayIndexChange(value,node) {
      console.log(value);
      this.form.dayIndex = value;
      this.form.dayIndexName = node.data.attrs.name;
    },
    handleTimeChange(val,field){
      this.form[field]=val
    }
  }
}
</script>