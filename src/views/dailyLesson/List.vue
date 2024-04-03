<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <!-- <a-form-item label="计划名称">
                <a-select
                 show-search
                 :value="planName"
                 placeholder="输入计划名称"
                 style="width: 200px"
                 :default-active-first-option="false"
                 :show-arrow="false"
                 :filter-option="false"
                 :not-found-content="null"
                 @search="handlePlanSearch"
                 @change="handlePlanChange"
                >
                  <a-select-option v-for="d in planList" :key="d.id">
                  {{ d.name }}
                  </a-select-option>
                </a-select>
              </a-form-item> -->
              <a-form-item label="状态">
                <a-select  v-model="queryParam.status"   style="width: 200px"    @change="(v,e)=>{}">
                   <a-select-option v-for="(val,key) in statusMap" :key="key" :value="key"  :text="val.text" >{{val.text}}</a-select-option>
               </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
                <a-form-item label="日期">
                  <a-date-picker v-model="queryParam.dateOfDay" @change="onDateOfDayChange" />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="老师">
                <a-select
                 show-search
                 :value="teacherName"
                 placeholder="输入老师姓名"
                 style="width: 200px"
                 :default-active-first-option="false"
                 :show-arrow="false"
                 :filter-option="false"
                 :not-found-content="null"
                 @search="handleTeacherSearch"
                 @change="handleTeacherChange"
                >
                  <a-select-option v-for="d in teacherList" :key="d.id">
                  {{ d.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="科目">
                <a-select
                 show-search
                 :value="subjectName"
                 placeholder="输入科目姓名"
                 style="width: 200px"
                 :default-active-first-option="false"
                 :show-arrow="false"
                 :filter-option="false"
                 :not-found-content="null"
                 @search="handleSubjectSearch"
                 @change="handleSubjectChange"
                >
                  <a-select-option v-for="d in subjectList" :key="d.id">
                  {{ d.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
        :scroll="{ x: 1500, y: 300 }"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-tag :status="text | statusTypeFilter" :text="text | statusFilter" :color="text|statusColorFilter">
            {{ text|statusFilter }}
          </a-tag>
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-space size="small">
              <a-popconfirm v-if="record.status==20041" title="确认开始?" @confirm="() => handleStartLesson(record,index)">
                  <a >开始</a>
              </a-popconfirm>
              <a-popconfirm v-if="record.status==20041" title="确认取消本节课?" @confirm="() => handleCancelLesson(record,index)">
                  <a >取消</a>
              </a-popconfirm>
               <a v-if="record.status==20042" @click="showStudent(record)">点名</a>
              <a-popconfirm v-if="record.status==20042" title="确认结束?" @confirm="() => handleFinishLesson(record,index)">
                  <a >结束</a>
              </a-popconfirm>
            </a-space>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :title="title"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <!-- <step-by-step-modal ref="modal" @ok="handleOk"/> -->
      <LessonStudent
      ref="studentModal"
        :visible="studentVisible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleStudentCancel"
        @ok="handleStudentOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { listDailyLesson, startDailyLesson,cancelDailyLesson ,finishDailyLesson  } from '@/api/coursePlan'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import EnrollForm from './modules/EnrollForm'
import LessonStudent from './modules/LessonStudent'
import { listTeacher } from '@/api/teacher'
import { listSubject } from '@/api/subject'

const columns = [
  // {
  //   title: '#',
  //   scopedSlots: { customRender: 'serial' }
  // },
  {
    title: '计划名称',
    dataIndex: 'planName',
    fixed: 'left',
    width: '130px',
    scopedSlots: { customRender: 'planName' }
  },
  {
    title: '课程编码',
    dataIndex: 'courseCode',
    fixed: 'left',
    width: '130px',
    scopedSlots: { customRender: 'courseCode' }
  },
  {
    title: '日期',
    dataIndex: 'dateOfDay',
    // fixed: 'left',
    scopedSlots: { customRender: 'dateOfDay' }
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    // fixed: 'left',
    scopedSlots: { customRender: 'startTime' }
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    // fixed: 'left',
    scopedSlots: { customRender: 'endTime' }
  },
  {
    title: '教室',
    dataIndex: 'roomName',
    scopedSlots: { customRender: 'roomName' }
  },
  {
    title: '老师',
    dataIndex: 'teacherName'
    // customRender: (text) => text === 1 ? '启用' : '停用'
  },
  {
    title: '科目',
    dataIndex: 'subjectName'
    // customRender: (text) => text === 1 ? '启用' : '停用'
  },
  {
    title: '年级',
    dataIndex: 'gradeName'
    // customRender: (text) => text === 1 ? '启用' : '停用'
  },
  {
    title: '课时',
    dataIndex: 'lessonNum'
    // customRender: (text) => text === 1 ? '启用' : '停用'
  },
  {
    title: '计划人数',
    dataIndex: 'planNum'
    // customRender: (text) => text === 1 ? '启用' : '停用'
  },
  {
    title: '报名人数',
    dataIndex: 'actualNum'
    // customRender: (text) => text === 1 ? '启用' : '停用'
  },
  {
    title: '签到人数',
    dataIndex: 'signNum'
    // customRender: (text) => text === 1 ? '启用' : '停用'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  20041: {
    status: 'pending',
    text: '未开始',
    color:'green'
  },
  20042: {
    status: 'scheduled',
    text: '上课中',
    color:'#1E90FF'
  },
  20043: {
    status: 'completed',
    text: '已结束',
    color:'#FF8C00'
  },
  20044: {
    status: 'cancled',
    text: '已取消',
    color:'#708090'
  },
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    EnrollForm,
    LessonStudent,
    StepByStepModal
  },
  data () {
    this.columns = columns
    this.statusMap=statusMap
    return {
      // create model
      title: null,
      visible: false,
      enrollVisible:false,
      studentVisible:false,
      adjustVisible:false,
      historyVisible:false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      teacherName:undefined,
      teacherList: [],
      subjectName:undefined,
      subjectList:[],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'date_of_day',
            'value': this.queryParam.dateOfDay || null,
            'op': '='
          },
          {
            'column': 'teacher_id',
            'value': this.queryParam.teacherId || null,
            'op': '='
          },
          {
            'column': 'subject_id',
            'value': this.queryParam.subjectId || null,
            'op': '='
          },
          {
            'column': 'status',
            'value': this.queryParam.status || null,
            'op': '='
          }
        ]
        }
        const newObj = { ...parameter, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listDailyLesson(newObj)
          .then(res => {
            return res
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      planList:[],
      planName:undefined,
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    statusColorFilter(type){
      return statusMap[type].color
    }

  },
  created () {
    // getRoleList({ t: new Date() })
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
      this.title = '新增'
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
      this.title = '修改'
    },
    handleEnroll (record) {
      this.enrollVisible = true
      this.mdl = { ...record }
      this.title = '报名'
    },
    showStudent (record) {
      this.studentVisible = true
      this.mdl = { ...record }
      this.title = '查看学生'
    },
    adjustLesson (record) {
      this.adjustVisible = true
      this.mdl = { ...record }
      this.title = '调整课时'
    },
    showHistory(record){
      this.historyVisible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            updateCustomer(values.id, values).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            }).catch(err=>{
              this.$message.error(err.response.data.message) 
            })

          } else {
            // 新增
            createCustomer(values).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            }).catch(err=>{
              this.$message.error(err.response.data.message) 
            })

          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleAdjustOk () {
      const form = this.$refs.adjustModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
            // 新增
            adjustLessonNumber(values).then(res => {
              this.adjustVisible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('操作成功')
            }).catch(err=>{
              this.$message.error(err.response.data.message) 
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleEnrollCancel () {
      this.enrollVisible = false
      this.$refs.table.refresh(true)
    },
    handleEnrollOk(){
      this.enrollVisible = false

      this.$refs.table.refresh(true)
    },
    handleHistoryCancel () {
      this.historyVisible = false

      // const form = this.$refs.adjustModal.form
      // form.resetFields() // 清理表单数据（可不做）
    },
    handleStudentCancel () {
      this.studentVisible = false
      this.$refs.table.refresh(true)
    },
    handleStudentOk(){
      this.studentVisible = false
      this.$refs.table.refresh(true)
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    handlePlanSearch(value) {
      let that =this
      var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'name',
            'value': value || null,
            'op': 'like'
          },{
            'column': 'status',
            'value':[30022,30023] ,
            'op': 'in'
          }
        ]
        }
      const newObj = { pageSize:999, 'expr': JSON.stringify(expr) }
      console.log('loadData request parameters:', newObj) 
      listCoursePlan(newObj).then(res=>{
        that.planList = res.data
      })
      // fetch(value, data => (this.data = data));
    },
    handlePlanChange(value,node) {
      console.log(value);
      // this.value = value;
      this.planName =value
      this.queryParam.planId=node.key
      // fetch(value, data => (this.data = data));
    },
    onDateOfDayChange(date,dateString){
      this.queryParam.dateOfDay=dateString
    },
    handleStartLesson(record){

      let that =this
      startDailyLesson({"id":record.id}).then(res=>{
        that.$message.success(`操作成功`)
        that.$refs.table.refresh()
      })
    },
    handleCancelLesson(record){

      let that =this
      cancelDailyLesson({"id":record.id}).then(res=>{
        that.$message.success(`操作成功`)
        that.$refs.table.refresh()
      })
    },
    handleFinishLesson(record){
      let that =this
      finishDailyLesson({"id":record.id}).then(res=>{
        that.$message.success(`操作成功`)
              // 刷新表格
        that.$refs.table.refresh()
      })
    },
    handleTeacherSearch(value) {
      let that =this
      var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'name',
            'value': value || null,
            'op': 'like'
          },{
            'column': 'status',
            'value':[10011] ,
            'op': 'in'
          }
        ]
        }
      const newObj = { pageSize:999, 'expr': JSON.stringify(expr) }
      console.log('loadData request parameters:', newObj) 
      listTeacher(newObj).then(res=>{
        that.teacherList = res.data
      })
      // fetch(value, data => (this.data = data));
    },
    handleTeacherChange(value,node) {
      this.teacherName =value
      this.queryParam.teacherId=node.key
    },

    handleSubjectSearch(value) {
      let that =this
      var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'name',
            'value': value || null,
            'op': 'like'
          },{
            'column': 'status',
            'value':[10011] ,
            'op': 'in'
          }
        ]
        }
      const newObj = { pageSize:999, 'expr': JSON.stringify(expr) }
      console.log('loadData request parameters:', newObj) 
      listSubject(newObj).then(res=>{
        that.subjectList = res.data
      })
      // fetch(value, data => (this.data = data));
    },
    handleSubjectChange(value,node) {
      this.subjectName =value
      this.queryParam.subjectId=node.key
    },
  }
}
</script>
