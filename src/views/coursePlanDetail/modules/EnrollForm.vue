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
         ref="planForm"
        :model="form"
        :rules="rules"
        layout='horizontal'
        >
            <a-form-model-item label="选择会员" prop="customerPhone">
              <a-select
                show-search
                v-model="form.customerPhone"
                placeholder="输入手机号"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleCustomerSearch"
                @change="handleCustomerChange"
              >
              <a-select-option v-for="d in customerList" :key="d.mobile" :name="d.name" >
                {{ d.mobile +"  "+ d.name }}
              </a-select-option>
            </a-select>
            </a-form-model-item>
            <a-form-model-item label="选择学生" prop="studentId">
              <a-select
                show-search
                v-model="form.studentId"
                placeholder="输入学生姓名"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleStudentSearch"
                @change="handleStudentChange"
              >
              <a-select-option v-for="d in studentList" :key="d.id" :name="d.name" >
                {{  d.name }}
              </a-select-option>
            </a-select>
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
import {  listCustomer} from '@/api/customer'
import {  listStudent} from '@/api/student'

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
      default: () => '报名'
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
      customerList:[],
      dayIndexList:[],
      studentList:[],
      subjectList:[],
      teacherList:[],


      form: {
        "id":undefined,
        "customerPhone":undefined,
        "studentId":undefined,
        "studentName":undefined,
        "planId":undefined,
        "planName":undefined,
        "planDetailId":undefined,
      },
      rules: {
        customerPhone: [
          { required: true, message: '请输入客户手机号', trigger: 'change' },
        ],
        studentId: [
          { required: true, message: '请输入学生姓名', trigger: 'change' },
        ],
      },
      confirmLoading: false,
      excludeRulecolumns:[
      {
          title: '排除类型',
          dataIndex: 'excludeType',
          key: 'excludeType',
          width: '40%',
          scopedSlots: { customRender: 'excludeType' }
        },
        {
          title: '日期',
          dataIndex: 'excludeDate',
          key: 'excludeDate',
          width: '40%',
          scopedSlots: { customRender: 'excludeDate' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      excludeRuleData:[],
      subjectTimeTableColumn:[
        {
          title: '科目',
          dataIndex: 'subjectId',
          key: 'subjectId',
          width: '40%',
          scopedSlots: { customRender: 'subjectId' }
        },
        {
          title: '年级',
          dataIndex: 'gradeId',
          key: 'gradeId',
          width: '40%',
          scopedSlots: { customRender: 'gradeId' }
        },
        {
          title: '人数',
          dataIndex: 'studentNum',
          key: 'studentNum',
          width: '40%',
          scopedSlots: { customRender: 'studentNum' }
        },
        {
          title: '课程时间',
          dataIndex: 'studentNum',
          key: 'studentNum',
          width: '40%',
          scopedSlots: { customRender: 'studentNum' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ]
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
        "customerPhone":undefined,
        "studentId":undefined,
        "studentName":undefined,
        "planId":undefined,
        "planName":undefined,
        "planDetailId":undefined,
      }
    },
   
    initForm(model){
      this.form={"planId":model.planId,"planName":model.planName,"planDetailId":model.id}
    },
    newExcludeRule () {
      this.excludeRuleData.push({
        key:this.excludeRuleData.length,
        excludeType:30012 ,
        excludeDate:[],
      })
    },
    submit(){
      let that =this
      this.confirmLoading = true

      this.$refs.planForm.validate(valid => {
        if (valid) {
          if (that.form.id) {
            // 修改 e.g.
            updateCoursePlanStudent(that.form.id, that.form).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              that.resetForm()
              this.$message.info('修改成功')
              this.$emit('ok') 
            })
          } else {
            // 新增
            createCoursePlanStudent(that.form).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              that.resetForm()
              this.$message.info('新增成功')
              this.$emit('ok') 
            })
          }
        } else {
            console.log(that.$refs.planForm.getFieldsError())
            that.confirmLoading = false
        }
      })

    },
    cancel(){
      this.resetForm()
      this.$emit('cancel') 
    },
    handleCustomerSearch(value) {
      
      var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'mobile',
            'value': value || null,
            'op': 'like'
          }
        ]
        }
        const newObj = { 'pageSize':999, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
        return listCustomer(newObj)
          .then(res => {
            this.customerList=res.data
          })
    },
    handleCustomerChange(value,node) {
      this.form.customerPhone = value;
      this.studentList=[]
      // this.form['studentId'] = undefined;
      // this.form['studentName'] = undefined;
      this.handleStudentSearch()
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