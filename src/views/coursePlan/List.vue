<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="名称">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <!-- <a-select v-model="queryParam.status"  placeholder="请选择" default-value=0>
                  <a-select-option value=10011>启用</a-select-option>
                  <a-select-option value=10012>禁用</a-select-option>
                </a-select> -->
                <a-select style="width: 100%"  v-model="queryParam.status" :allowClear="true">
                  <a-select-option v-for="(item,key) in statusMap" :key="key" :value="key" >{{  item.text }}</a-select-option>
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
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <!-- <a-switch :checked="text==10011" @change="onStatusChange(text,record)" /> -->
          <a-tag :status="text | statusTypeFilter" :text="text | statusFilter" :color="text|statusColorFilter">
            {{ text|statusFilter }}
          </a-tag>

        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="subjects" slot-scope="text">
            <a-tag v-for="tag in text" :key="tag" color="blue">{{ formatSubject(tag) }}</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-space size="small">
              <a v-if="record.status==30021" @click="handleEdit(record)">修改</a>
              <a v-if="record.status==30021" @click="handleRelease(record)">发布</a>
              <a v-if="record.status==30022" @click="handleScheduleLesson(record)">批量排课</a>

              <a-popconfirm title="确认排期?" @confirm="() => handleScheduleDate(record,index)">
                  <a v-if="record.status==30022">快速排期</a>
              </a-popconfirm>
            </a-space>
          </template>
        </span>
      </s-table>

      <schedule-lesson-form
      ref="scheduleModal"
       :model="mdl"
        :title="title"
        :visible="schdeuleLessonFormVisible"
        :loading="confirmLoading"
        @cancel="handleScheduleLessonCancel"
        @ok="handleScheduleLessonOk"
       ></schedule-lesson-form>
      <create-form
      ref="createModal"
       :model="mdl"
        :title="title"
        :visible="visible"
        :loading="confirmLoading"
        @cancel="handleCancel"
        @ok="handleOk"
       ></create-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { listCoursePlan, createCoursePlan, updateCoursePlan,releaseCoursePlan,sheduleDateForCoursePlan } from '@/api/coursePlan'
import { listSubject } from '@/api/subject'

// import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import ScheduleLessonForm from './modules/ScheduleLessonForm'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'code' }
  },
  {
    title: '备注',
    dataIndex: 'description'
    // customRender: (text) => text === 1 ? '启用' : '停用'
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    scopedSlots: { customRender: 'startTime' }
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    scopedSlots: { customRender: 'startTime' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
    // customRender: (text) => text === 0 ? '启用' : '停用'
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '160px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  30021: {
    status: 'new',
    text: '新纪录',
    color:'green'
  },
  30022: {
    status: 'released',
    text: '已发布',
    color:'#1E90FF'
  },
  30023: {
    status: 'picking',
    text: '已排期',
    color:'purple'
  },
  30024: {
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
    ScheduleLessonForm
  },
  data () {
    this.columns = columns
    this.statusMap=statusMap
    return {

      // create model
      title: null,
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,

      schdeuleLessonFormVisible: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'name', 'value': this.queryParam.name || null, 'op': 'like'
          }, { 'column': 'status', 'value': this.queryParam.status || null, 'op': '=' }]
        }
        const newObj = { ...parameter, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listCoursePlan(newObj)
          .then(res => {
            return res
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      subjectsMap: {},
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    statusColorFilter(type) {
      return statusMap[type].color
    }
  },
  created () {
    // getRoleList({ t: new Date() })
    this.initSubjectMap();
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
    handleScheduleLesson(record){
      
      this.schdeuleLessonFormVisible=true
      this.mdl=record
    },
    handleScheduleDate(record){
      let that =this

      sheduleDateForCoursePlan({"id":record.id}).then(res=>{
        that.$notification.success({
            message: "排课成功"
        })  
      }).catch(e=>{
        console.log(e)
      })

    },
    handleOk () {
        // 刷新表格
        this.$refs.table.refresh()
      },
    handleCancel () {
      this.visible = false
    },
    handleScheduleLessonOk () {
      this.schdeuleLessonFormVisible = false
        // 刷新表格
        this.$refs.table.refresh()
    },
    handleScheduleLessonCancel () {
      this.schdeuleLessonFormVisible = false
    },
    handleRelease(record){
      let that =this
      releaseCoursePlan({"idList":[record.id]}).then(res=>{

        that.$notification.success({
            message: "成功："+res.successNum+"失败："+res.failureNum +"错误信息："+res.message,
        }) 
        
        this.$refs.table.refresh()
      })

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
    formatSubject(subject) {
      console.log(this.subjectsMap)
      if (this.subjectsMap&& this.subjectsMap[subject]){
        return this.subjectsMap[subject].name
      }
    },
    initSubjectMap(){
      let that =this
        var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
          }, { 'column': 'status', 'value': 10011, 'op': '=' }]
        }
        // todo 
        const newObj = { 'expr': JSON.stringify(expr) }
        listSubject(newObj) .then(res => {
          let subjects={}
          for (let  subject of res.data){
            subjects[subject.id]=subject
          }
          that.subjectsMap=subjects
          })
    },
    onStatusChange(status,record){
      let that =this
      record.status= record.status==10011?10012:10011
      updateCoursePlan(record.id,record).then(res=>{
          that.$notification.success({
            message: record.status==10011?"启用成功":"禁用成功",
        })
      })

    }

  }
}
</script>
