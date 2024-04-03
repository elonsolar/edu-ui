<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名">
                <a-input v-model="queryParam.username" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="手机号">
                <a-input v-model="queryParam.mobile" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value=0>
                  <a-select-option value=10011>启用</a-select-option>
                  <a-select-option value=10012>禁用</a-select-option>
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

          <!-- <a-switch :checked="text==10011" @change="onStatusChange(text,record)" /> -->
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="subjects" slot-scope="text">
            <a-tag v-for="tag in text" :key="tag" color="blue">{{ formatSubject(tag) }}</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-space>
              <a v-action:update @click="handleEdit(record)">修改</a>
              <a v-action:changePassword @click="changePassword(record)">修改</a>
              <a v-if="record.status==10012" v-action:enable @click="changeStatus(10011, record)">启用</a>
              <a v-if="record.status==10011" v-action:disable @click="changeStatus(10012,record)">停用</a>
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
      <change-pwd-form
        ref="createModal"
        :title="title"
        :visible="changePasswordVisible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleChangePwdCancel"
        @ok="handleChangePwdOk"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { listUser,updateUser,createUser, changePassword } from '@/api/manage'

import CreateForm from './modules/CreateForm'
import ChangePwdForm from './modules/CreateForm'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '用户名',
    dataIndex: 'username',
    scopedSlots: { customRender: 'username' }
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    scopedSlots: { customRender: 'mobile' }
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
  10011: {
    status: 'processing',
    text: '启用'
  },
  10012: {
    status: 'default',
    text: '停用'
  }
}



export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    ChangePwdForm
  },
  data () {
    this.columns = columns
    return {
      // create model
      title: null,
      visible: false,
      changePassword:false,
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
            { 'column': 'username', 'value': this.queryParam.username || null, 'op': 'like' },
           { 'column': 'mobile', 'value': this.queryParam.mobile || null, 'op': 'like' },
           { 'column': 'status', 'value': this.queryParam.status || null, 'op': '=' }
          ]
        }
        const newObj = { ...parameter, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listUser(newObj)
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
    changePassword(record){
      this.changePasswordVisible = true
      this.mdl = { ...record }
      this.title = '修改密码'
    },
    handleChangePwdOk(){
      this.changePasswordVisible=false
      this.$refs.table.refresh()
    },
    handleChangePwdCancel(){
      this.changePasswordVisible=false
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            updateUser(values.id, values).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            createUser(values).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
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
    formatSubject(subject) {
      console.log(this.subjectsMap)
      if (this.subjectsMap&& this.subjectsMap[subject]){
        return this.subjectsMap[subject].name
      }
    },
    changeStatus(status,record){
      let that =this
      record.status= status
      updateUser(record.id,record).then(res=>{
          that.$notification.success({
            message: status==10011?"启用成功":"禁用成功",
        })
        that.$refs.table.refresh()
      })

    }

  }
}
</script>
