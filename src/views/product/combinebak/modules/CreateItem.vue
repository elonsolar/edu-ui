<template>
  <a-modal
    :title="title"
    :width="540"
    :visible="visible"
    :confirmLoading="loading"
    @ok="submit"
    @cancel="cancel"
  >
    <a-spin :spinning="loading">
        <a-form-model
         ref="itemForm"
        :model="form"
        :rules="rules"
        layout='horizontal'
        >
            <a-form-model-item label="选择单品" prop="skuId">
              <a-select
                show-search
                v-model="form.skuId"
                placeholder="输入单品名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSkuSearch"
                @change="handleSkuChange"
              >
              <a-select-option v-for="d in skuList" :key="d.id" :name="d.name" :code="d.code" :price="d.price"  >
                {{  d.name }}
              </a-select-option>
            </a-select>
            </a-form-model-item>
            <a-form-model-item label="编码" prop="skuCode" >
                <a-input v-model="form.skuCode" disabled=true >
                </a-input>
            </a-form-model-item>
            <a-form-model-item label="单价" prop="skuPrice"  >
                <a-input v-model="form.skuPrice" disabled=true >
                </a-input>
            </a-form-model-item>
            <a-form-model-item label="数量" prop="skuQuantity">
                <a-input-number v-model="form.skuQuantity" style="width:100%" placeholder="输入数量"/>
            </a-form-model-item>
    </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
/* eslint-disable */ 
import pick from 'lodash.pick'
import moment from 'moment'
import {   createCoursePlanStudent, updateCoursePlanStudent } from '@/api/coursePlan'
import {  listSku,createCombineSkuItem,updateCombineSkuItem} from '@/api/product'

// 表单字段

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
      // default: () => '添加明细'
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
      moment:moment,
      skuList:[],
      form: {
        "id":undefined,
        "combineId":undefined,
        "skuId":undefined,
        "skuCode":undefined,
        "skuName":undefined,
        "skuPrice":undefined,
        "skuQuantity":undefined,
      },
      rules: {
        customerPhone: [
          { required: true, message: '请输入客户手机号', trigger: 'change' },
        ],
        studentId: [
          { required: true, message: '请输入学生姓名', trigger: 'change' },
        ],
      },
      confirmLoading: false
    }
      
  },
  beforeCreate() {
  },
  created () {
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.initForm(this.model)
    })
  },
  methods:{
    resetForm(){
      this.form={
        "id":undefined,
        "combineId":undefined,
        "skuId":undefined,
        "skuCode":undefined,
        "skuName":undefined,
        "skuPrice":undefined,
        "skuQuantity":undefined,
      }
    },
   
    initForm(model){
      debugger
      this.form={
        ...model,
      }
      this.handleSkuSearch()
    },
    submit(){
      let that =this
      this.confirmLoading = true

      this.$refs.itemForm.validate(valid => {
        if (valid) {
          if (that.form.id) {
            // 修改 e.g.
            updateCombineSkuItem(that.form.id, that.form).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              that.resetForm()
              this.$message.info('修改成功')
              this.$emit('ok') 
            })
          } else {
            // 新增
            createCombineSkuItem(that.form).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              that.resetForm()
              this.$message.info('新增成功')
              this.$emit('ok') 
            })
          }
        } else {
            console.log(that.$refs.itemForm.getFieldsError())
            that.confirmLoading = false
        }
      })

    },
    cancel(){
      this.resetForm()
      this.$emit('cancel') 
    },
    handleSkuSearch(value) {
      
      var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'name',
            'value': value || null,
            'op': 'like'
          }
        ]
        }
        const newObj = { 'pageSize':999, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listSku(newObj)
          .then(res => {
            this.skuList=res.data
          })
    },
    handleSkuChange(value,node) {
      this.form.skuId = value;
      this.form.skuCode=node.data.attrs.code
      this.form.skuName=node.data.attrs.name
      this.form.skuPrice=node.data.attrs.price
      // this.form['studentId'] = undefined;
      // this.form['studentName'] = undefined;
    },
    handleStudentSearch(value) {
      
      var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'mobile',
            'value': this.form.customerPhone || "undefined", 
            'op': '='
          },
          {
            'column': 'name',
            'value': value || null, 
            'op': 'like'
          }
        ]
        }
        const newObj = { 'pageSize':999, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listStudent(newObj)
          .then(res => {
            this.studentList=res.data
          })
    },
    handleStudentChange(value,node) {
      this.form.studentId = value;
      this.form.studentName = node.data.attrs.name;
    },
  }
}
</script>