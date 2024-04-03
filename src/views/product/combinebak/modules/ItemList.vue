<template>
    <a-modal
    title="套餐明细"
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
              <a-form-item label="名称">
                <a-input v-model="queryParam.skuName" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
                <a-form-item label="编码">
                  <a-input v-model="queryParam.skuCode" style="width: 100%"/>
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
        <a-button type="primary" icon="plus" @click="handleAdd">添加</a-button>
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
          <a-tag :status="text | statusTypeFilter" :text="text | statusFilter" :color="text|statusColorFilter">
            {{ text|statusFilter }}
          </a-tag>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a-space size="small">
            <a @click="handleEdit(record)">修改</a>
            </a-space>
          </template>
        </span>
      </s-table>
    </a-card>
    <CreateItem
      ref="itemModal"
        :visible="itemCreateVisible"
        :title="title"
        :loading="confirmLoading"
        :model="item"
        @cancel="handleCreateCancel"
        @ok="handleCreateOk"
      />
    </a-modal>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { listCombineSkuItem } from '@/api/product'
import CreateItem from './CreateItem.vue'


const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '编码',
    dataIndex: 'skuCode',
    scopedSlots: { customRender: 'skuCode' }
  },
  {
    title: '名称',
    dataIndex: 'skuName',
    // scopedSlots: { customRender: 'mobile' }
  },
  {
    title: '价格',
    dataIndex: 'skuPrice',
    // scopedSlots: { customRender: 'mobile' }
  },
  {
    title: '数量',
    dataIndex: 'skuQuantity',
    // scopedSlots: { customRender: 'mobile' }
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
  30041: {
    status: 'new',
    text: '新纪录',
    color:'green'
  },
  30042: {
    status: 'scheduled',
    text: '已排期',
    color:'purple'
  },
  30043: {
    status: 'stopped',
    text: '已停课',
    color:'#708090'
  }
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
    CreateItem
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
      itemCreateVisible:false,
      confirmLoading: false,
      mdl: null,
      item: undefined,
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
            'column': 'sku_name',
            'value': this.queryParam.skuName || null,
            'op': 'like'
          },
          {
            'column': 'sku_code',
            'value': this.queryParam.skuCode,
            'op': '='
          },
          {
            'column': 'combine_id',
            'value': this.model.id || null,
            'op': '='
          },
        ]
        }
        const newObj = { ...parameter, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listCombineSkuItem(newObj)
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
    statusColorFilter (type) {
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
    this.$watch('model', () => {
      // this.model 
      debugger
      this.$refs.table.refresh(true)
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
      this.item = {"combineId":this.model.id}
      this.itemCreateVisible = true
      this.title = '新增'
    },
    handleEdit (record) {
      this.itemCreateVisible = true
      this.item = { ...record }
      this.title = '修改'
    },
    handleCreateOk () {
      this.itemCreateVisible = false
      this.$refs.table.refresh(true)
    },
    handleCreateCancel () {
      this.itemCreateVisible = false
      this.$refs.table.refresh(true)
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
    handleEnrollCancel () {
      this.enrollVisible = false
      this.$refs.table.refresh(true)
    },
    handleEnrollOk(){
      this.enrollVisible = false
      this.$refs.table.refresh(true)
    },
    handleStop(record){
      stopCombineItem({id:record.id}).then(res=>{

      })
    }
  }
}
</script>
