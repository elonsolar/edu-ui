<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="submit"
    @cancel="() => { $emit('ok') }"
  >
  <a-tree
    checkable
    :tree-data="treeData"
    :defaultExpandAll="true"
    :checkStrictly="true"
    v-model="selectedKeys"
    :replace-fields="replaceFields"
    @check="checkTreeNode"
    >
   </a-tree>

  </a-modal>
</template>

<script>
/* eslint-disable */ 
import pick from 'lodash.pick'
import { getTenantPermissionTree} from '@/api/tenant'
import {  saveRolePermission,getRolePermission} from '@/api/role'

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
      default: () => '权限设置'
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
      treeData: [],
      replaceFields: {
        title: 'name',
        key:'id'
      },
      selectedKeys:{checked:[],halfChecked:[]},
      parentKeys:[]
    }
  },
  created () {
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.getTree()
    })

  },
  methods:{
    getTree(){
      let that =this
      getTenantPermissionTree({"parentId":0}).then(res=>{
            that.treeData=res.data
      })

      getRolePermission({"roleId":this.model.id}).then(res=>{
         that.selectedKeys.checked=res.permissions
      })
    },
    submit(){
      saveRolePermission({"roleId":this.model.id,"permissions":this.selectedKeys.checked}).then(res=>{
         this.selectedKeys=res
         this.$emit('ok')
        this.$message.info('修改成功')
      })

    },
    checkTreeNode(checkedKeys,node){
      console.log(node.node.eventKey)
      this.alterChildrenChecked(node.node.eventKey,node.checked)

      this.alterParentChecked(node.node.eventKey,node.checked)
    },
    alterChildrenChecked(id,checked){
      this.parentKeys=[]

      let current = this.getNodeById(this.treeData,id)

      let childrenKeys = this.getChildenKeys(current,false)

      if (checked){
        let selectedKeys=this.selectedKeys.checked.concat(childrenKeys)
        let selectedKeysSet = new Set(selectedKeys)
        this.selectedKeys.checked=Array.from(selectedKeysSet.values())
      }else{
        this.selectedKeys.checked=this.selectedKeys.checked.filter(v=>{ return !childrenKeys.includes(v)})
      }

    },
    alterParentChecked(id,checked){

      if (checked){
        let selectedKeys=this.selectedKeys.checked.concat(this.parentKeys)
        let selectedKeysSet = new Set(selectedKeys)
        this.selectedKeys.checked=Array.from(selectedKeysSet.values())
      }
        

    },
    getNodeById(nodes,id){
      for (let node of nodes){
        if (node.id==id){
          return node
        }
        if(node.children.length!=0){
           let found = this.getNodeById(node.children,id)
           if (found){
              this.parentKeys.push(node.id) // 父节点
              return found
           }else{
              continue
           }
        }
      }
    },
    getChildenKeys(node){

      let childKeys = []
      let remainNodes=[node]

      while(remainNodes.length!=0){
        let first =remainNodes.shift()
        childKeys.push(first.id)
        if(first.children && first.children.length>0){
          remainNodes=remainNodes.concat(first.children)
        }
      }
      return childKeys
    },

  }
}
</script>
