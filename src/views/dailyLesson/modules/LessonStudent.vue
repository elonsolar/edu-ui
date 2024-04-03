<template>
    <a-modal
    title="上课学生"
    :width="840"
    :visible="visible"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="学生姓名">
                <a-input v-model="queryParam.studentName" placeholder=""/>
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
        <!-- <span slot="sourceType" slot-scope="text">
          <a-badge :status="text | sourceTypeFilter" :text="text | sourceFilter" />
        </span> -->
        <span slot="status" slot-scope="text">
          <a-tag :status="text | statusTypeFilter" :text="text | statusFilter" :color="text|statusColorFilter">
            {{ text|statusFilter }}
          </a-tag>
        </span>
        <!-- <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span> -->

        <span slot="action" slot-scope="text, record">
          <template>
            <a-space size="small">
            <a v-if="record.status==20051" @click="handleSign(record)">签到</a>
            <a v-if="record.status==20051" @click="handleLeave(record)">请假</a>
            </a-space>
          </template>
        </span>
      </s-table>
    </a-card>
    </a-modal>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { listDailyLessonStudent ,signDailyLessonStudent,leaveDailyLessonStudent} from '@/api/coursePlan'


const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '会员手机号',
    dataIndex: 'customerPhone',
    scopedSlots: { customRender: 'customerPhone' }
  },
  {
    title: '学生姓名',
    dataIndex: 'studentName',
    // scopedSlots: { customRender: 'mobile' }
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
    width: '100px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  20051: {
    status: 'default',
    text: '未签到',
    color:"#98FB98"
  },
  20052: {
    status: 'default',
    text: '已签到',
    color:"#FFA500"
  },
  20053: {
    status: 'default',
    text: '请假',
    color:"#FF4500"
  },
  20054: {
    status: 'default',
    text: '已取消',
    color:"#808080"
  },
}
const sourceTypeMap = {
  20011: {
    status: 'default',
    text: '手工调整'
  },
  20012: {
    status: 'purchase order',
    text: '订单购买'
  },
  20013: {
    status: 'roll call',
    text: '点名签到'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.columns = columns
    return {
      // create model
      title: null,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [
          {
            'column': 'student_name',
            'value': this.queryParam.studentName || null,
            'op': 'like'
          },
          {
            'column': 'lesson_id',
            'value': this.model.id,
            'op': '='
          },
          {
            'column': 'customer_phone',
            'value': this.queryParam.mobile || null,
            'op': 'like'
          },
        ]
        }
        const newObj = { ...parameter, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listDailyLessonStudent(newObj)
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
    },
    statusColorFilter(type){
      return statusMap[type].color
    },
    sourceFilter (type) {
      return sourceTypeMap[type].text
    },
    sourceTypeFilter (type) {
      return sourceTypeMap[type].status
    }
  },
  created () {
    // getRoleList({ t: new Date() })
    this.$watch('model', () => {
      this.model && this.$refs.table.refresh(true)
    })
  },
  mounted(){

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
    handleOk () {
      let that =this
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
    handleAdjustCancel () {
      this.adjustVisible = false

      const form = this.$refs.adjustModal.form
      form.resetFields() // 清理表单数据（可不做）
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
    handleSign(record){
      let that =this
      signDailyLessonStudent({id:record.id}).then(res=>{
            that.$message.info('操作成功')
            that.$refs.table.refresh()
      })

    },
    handleLeave(record){
      let that =this
      leaveDailyLessonStudent({id:record.id}).then(res=>{
            that.$message.info('操作成功')
            that.$refs.table.refresh()
      })


    }
  }
}
</script>
