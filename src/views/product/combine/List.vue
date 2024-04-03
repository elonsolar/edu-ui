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
              <a-form-item label="编码">
                <a-input v-model="queryParam.code" placeholder=""/>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-item label="类别">
                <a-select v-model="queryParam.category" placeholder="请选择" default-value=0>
                  <a-select-option v-for="(item,key) in categoryMap" :value="key" :key="key">{{ item.text }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
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
        <a-button  type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown  v-if="selectedRowKeys.length > 0">
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

        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-space>
              <a  @click="handleEdit(record)">修改</a>
              <a v-if="record.status==20082" @click="placeUp(record)" >上架</a>
              <a-popconfirm v-if="record.status==20081" title="确认下架?" @confirm="() => takeDown(record)">
                  <a>下架</a>
              </a-popconfirm>
              <!-- <a  @click="showDetailList(record)">明细</a> -->
            </a-space>
          </template>
        </span>
      </s-table>

      <!-- <create-form
        ref="createModal"
        :title="title"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      /> -->
      <ItemList
        ref="itemModal"
        :visible="itemVisible"
        :loading="confirmLoading"
        :model="itemMdl"
        @cancel="handleItemCancel"
        @ok="handleItemOk"
      />
    </a-card>
    <CreateForm
        ref="createModal"
        :title="title"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
  </page-header-wrapper>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { listCombineSku,updateCombineSku,createCombineSku,takeDown,placeUp, takeDownCombineSku, placeUpCombineSku } from '@/api/product'

import CreateForm from './modules/CreateForm'
const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '编码',
    dataIndex: 'code',
    scopedSlots: { customRender: 'code' }
  },
  {
    title: '单价',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '备注',
    dataIndex: 'description'
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
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  20081: {
    status: 'processing',
    text: '在售',
  },
  20082: {
    status: 'default',
    text: '下架'
  }
}


const categoryMap = {
  20071: {
    status: 'lesson',
    text: '课时',
    color:'cyan'
  },
  20072: {
    status: 'book',
    text: '教材',
    color:'orange'
  },
  20073: {
    status: 'other',
    text: '其他',
    color: 'purple'
  }
}


export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
  },
  data () {
    this.columns = columns
    this.categoryMap=categoryMap
    return {
      // create model
      title: null,
      visible: false,
      itemVisible:false,
      changePassword:false,
      confirmLoading: false,
      mdl: null,
      itemMdl:null,
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
            { 'column': 'name', 'value': this.queryParam.name || null, 'op': 'like' },
           { 'column': 'code', 'value': this.queryParam.code || null, 'op': 'like' },
           { 'column': 'category', 'value': this.queryParam.category || null, 'op': '=' }
          ]
        }
        const newObj = { ...parameter, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listCombineSku(newObj)
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
    categoryFilter (type) {
      return categoryMap[type].text
    },
    categoryTypeFilter (type) {
      return categoryMap[type].status
    },
    categoryColorFilter (type) {
      return categoryMap[type].color
    },
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
    showDetailList (record) {
      this.itemVisible = true
      this.itemMdl = { ...record }
      this.title = '修改'
    },
    placeUp(record){
      this.confirmLoading = true
      placeUpCombineSku({"id":record.id}).then(res => {
          this.confirmLoading = false
          // 刷新表格
          this.$refs.table.refresh()
          this.$message.info('上架成功')
      })
    },
    takeDown(record){
      this.confirmLoading = true
      takeDownCombineSku({"id":record.id}).then(res => {
          this.confirmLoading = false
          // 刷新表格
          this.$refs.table.refresh()
          this.$message.info('下架成功')
      })
    },
    handleChangePwdOk(){
      this.changePasswordVisible=false
      this.$refs.table.refresh()
    },
    handleChangePwdCancel(){
      this.changePasswordVisible=false
    },
    handleOk () {
      this.visible = false
      this.$refs.table.refresh()
    },
    handleCancel () {
      this.visible = false
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    handleItemOk () {
      this.itemVisible = false
    },
    handleItemCancel () {
      this.itemVisible = false
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
