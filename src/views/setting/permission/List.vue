<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <a-tree
    :tree-data="treeData"
    :defaultExpandAll="true"
    :default-selected-keys="selectedKeys"
    :replace-fields="replaceFields"
    @select="onTreeNodeSelect">
    <template #title="{ id: treeKey, name }">
      <a-dropdown :trigger="['contextmenu']">
        <span>{{ name }}</span>
        <template #overlay>
          <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
            <!-- <a-menu-item v-action:update key="updateMenu">修改</a-menu-item> -->
             <a-menu-item key="updateMenu">修改</a-menu-item>
            <a-menu-item key="addSubMenu">新增子菜单</a-menu-item>
            <a-menu-item key="addSubButton">新增子按钮</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </a-tree>
      </a-col>
      <a-col :span="19">
        <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text,record">

          <a-switch :checked="text==10011" @change="onStatusChange(text,record)" />
          <!-- <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" /> -->
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="subjects" slot-scope="text">
            <a-tag v-for="tag in text" :key="tag" color="blue">{{ formatSubject(tag) }}</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a v-action:update @click="handleEdit(record)">修改</a>
          </template>
        </span>
      </s-table>
      </a-col>
    </a-row>
    <create-form
        ref="createModal"
        :title="title"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
  </a-card>
  </template>

<script>
/* eslint-disable */
import { getPermissions } from '@/api/manage'
import { getPermissionTree, listPermission, createPermission, updatePermission } from '@/api/permission'
import { STable, Ellipsis } from '@/components'
import CreateForm from './modules/CreateForm'
const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '编码',
    dataIndex: 'code',
    scopedSlots: { customRender: 'code' }
  },
  {
    title: '名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
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
    status: 'default',
    text: '启用'
  },
  10012: {
    status: 'processing',
    text: '停用'
  }
}



export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm 
  },
  data () {
    this.columns = columns
    return {
      replaceFields: {
        title: 'name',
        key:'id'
      },
      treeData:[],
      expandedKeys:[],
      parentId:undefined,
      selectedKeys:[1],
      // create model
      title: null,
      visible: false,
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
            { 'column': 'parent_id', 'value': this.parentId|| null, 'op': '=' },
           { 'column': 'permission_type', 'value': 40012, 'op':'='},
          ]
        }
        const newObj = { ...parameter, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listPermission(newObj)
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
    this.getTree()
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
    onTreeNodeSelect(selectedKeys, info){
      console.log("selectedkeys", selectedKeys,info)
      this.parentId=selectedKeys[0]
      this.$refs.table.refresh(true)
    },
    getTree(parentId){
      if (!parentId){
        parentId=0
      }
      let that =this
      getPermissionTree({"parentId":parentId,"permissionType":40011}).then(res=>{
        that.treeData=res.data
      })
    },
    handleUpdateMenu(menuId){
      this.title="修改"
      this.mdl = {"id":menuId,"permissionType":40011}
      this.visible = true
    },
    handleAddSubMenu(menuId){
      this.title="添加菜单"
      this.mdl = {"parentId":menuId,"permissionType":40011}
      this.visible = true
    },
    handleAddSubButton(menuId){
      this.title="添加按钮"
      this.mdl = {"parentId":menuId,"permissionType":40012}
      this.visible = true
    },
    onContextMenuClick(key,action){
      console.log("key:= "+ key +" action:= "+action)
      if (action =="updateMenu"){
        this.handleUpdateMenu(key)
      }else if (action=="addSubMenu"){
        this.handleAddSubMenu(key)
      } else if (action == "addSubButton"){
        this.handleAddSubButton(key)
      }
    },
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
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            updatePermission(values.id, values).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.getTree()


              this.$message.info('修改成功')
            })
          } else {
            // 新增
            createPermission(values).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
              this.getTree()
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
      updateUser(record.id,record).then(res=>{
          that.$notification.success({
            message: record.status==10011?"启用成功":"禁用成功",
        })
      })

    },

  }
}
</script>