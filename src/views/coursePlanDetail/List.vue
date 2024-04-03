<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="计划名称">
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
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value=30031>
                  <a-select-option value=30031>新纪录</a-select-option>
                  <a-select-option value=30032>已排期</a-select-option>
                  <a-select-option value=30033>已停课</a-select-option>
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
              <template v-if="record.status==30031">
                <a @click="handleEdit(record)">修改</a>
                <a @click="handleDelete(record)">删除</a>
                <a @click="handleSchedule(record)">排期</a>
              </template>
            <a-popconfirm v-if="record.status==30032" title="确认停课?" @confirm="() => handleStop(record,index)">
                  <a v-if="record.status==30032">停课</a>
            </a-popconfirm>
            <a @click="showStudent(record)">学生管理</a>
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
      <EnrollForm
      ref="enrollModal"
        :visible="enrollVisible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleEnrollCancel"
        @ok="handleEnrollOk"
      />
      <PlanStudent
      ref="studentModal"
        :visible="studentVisible"
        :loading="confirmLoading"
        :model="studentMdl"
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
import { listCoursePlan, listCoursePlanDetailWithPage ,deleteCoursePlanDetail,stopCoursePlanDetail,scheduleDateForCoursePlanDetail} from '@/api/coursePlan'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import EnrollForm from './modules/EnrollForm'
import PlanStudent from './modules/PlanStudent'

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
    dataIndex: 'code',
    fixed: 'left',
    width: '130px',
    scopedSlots: { customRender: 'code' }
  },
  {
    title: '日期',
    dataIndex: 'dayIndexName',
    // fixed: 'left',
    scopedSlots: { customRender: 'dayIndexName' }
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
    title: '状态',
    dataIndex: 'status',
    fixed: 'right',
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
  30031: {
    status: 'new',
    text: '新纪录',
    color:'green'
  },
  30032: {
    status: 'scheduled',
    text: '已排期',
    color:'#1E90FF'
  },
  30033: {
    status: 'stoped',
    text: '已停课',
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
    PlanStudent,
    StepByStepModal
  },
  data () {
    this.columns = columns
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
      studentMdl:null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'plan_id',
            'value': this.queryParam.planId || null,
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
        return listCoursePlanDetailWithPage(newObj)
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
      this.studentMdl = { ...record }
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
      this.visible=false
      this.confirmLoading = false
      this.$refs.table.refresh()
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
      this.confirmLoading=false
      this.studentVisible = false
      this.$refs.table.refresh(true)
    },
    handleStudentOk(){
      this.confirmLoading=false
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
    handleDelete(record){
      let that =this
      deleteCoursePlanDetail(record.id).then(res=>{
          that.$message.info('操作成功')
          that.$refs.table.refresh()
      })
    },
    handleStop(record){
      let that =this
      stopCoursePlanDetail({id:record.id}).then(res=>{
          that.$message.info('操作成功')
          that.$refs.table.refresh()
      })
    },
    handleSchedule(record){
      let that =this
      scheduleDateForCoursePlanDetail({id:record.id}).then(res=>{
          that.$message.info('操作成功')
          that.$refs.table.refresh()
      })
    }
  }
}
</script>
