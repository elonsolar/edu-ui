<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
                <a-form-item label="手机">
                  <a-input v-model="queryParam.mobile" style="width: 100%"/>
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
        <a-button v-action:add type="primary" icon="plus" @click="handleAdd">新建</a-button>
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
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-space size="small">
            <a v-action:update @click="handleEdit(record)">修改</a>
            <a v-action:adjust @click="adjustLesson(record)">调整课时</a>
            <a v-action:history @click="showHistory(record)">课时记录</a>
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
      <adjust-form
        ref="adjustModal"
        :title="title"
        :visible="adjustVisible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleAdjustCancel"
        @ok="handleAdjustOk"
      />
      <!-- <step-by-step-modal ref="modal" @ok="handleOk"/> -->
      <lesson-history
      ref="historyModal"
        :visible="historyVisible"
        :loading="confirmLoading"
        :model="historyMdl"
        @cancel="handleHistoryCancel"
        @ok="handleHistoryOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { listCustomer, createCustomer, updateCustomer,adjustLessonNumber } from '@/api/customer'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import AdjustForm from './modules/AdjustForm'
import LessonHistory from './modules/LessonHistory'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '姓名',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    scopedSlots: { customRender: 'mobile' }
  },
  {
    title: '社区',
    dataIndex: 'community',
    // scopedSlots: { customRender: 'status' }
  },
  {
    title: '课时',
    dataIndex: 'lessonNumber',
    // scopedSlots: { customRender: 'status' }
  },
  {
    title: '备注',
    dataIndex: 'description'
    // customRender: (text) => text === 1 ? '启用' : '停用'
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  0: {
    status: 'default',
    text: '启用'
  },
  1: {
    status: 'processing',
    text: '停用'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    AdjustForm,
    LessonHistory,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      // create model
      title: null,
      visible: false,
      adjustVisible:false,
      historyVisible:false,
      confirmLoading: false,
      mdl: null,
      historyMdl:null,
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
            'column': 'name',
            'value': this.queryParam.name || null,
            'op': 'like'
          },
          {
            'column': 'status',
            'value': this.queryParam.status || null,
            'op': '='
          },
          {
            'column': 'mobile',
            'value': this.queryParam.mobile || null,
            'op': '='
          },
          {
            'column': 'community',
            'value': this.queryParam.community || null,
            'op': 'like'
          }
        ]
        }
        const newObj = { ...parameter, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listCustomer(newObj)
          .then(res => {
            return res
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
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
    adjustLesson (record) {
      this.adjustVisible = true
      this.mdl = { ...record }
      this.title = '调整课时'
    },
    showHistory(record){
      this.historyVisible = true
      this.historyMdl = { ...record }
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
              this.confirmLoading = false
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
              // this.$message.error(err.response.data.message) 
              this.confirmLoading = false
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
    handleAdjustCancel () {
      this.adjustVisible = false

      const form = this.$refs.adjustModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleHistoryOk(){
      this.historyVisible = false
    },
    handleHistoryCancel () {
      this.historyVisible = false

      // const form = this.$refs.adjustModal.form
      // form.resetFields() // 清理表单数据（可不做）
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
    }
  }
}
</script>
