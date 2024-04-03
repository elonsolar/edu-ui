<template>
  <a-modal
    title="批量排课"
    width="100%"
    :visible="visible"
    :confirmLoading="loading"
    okText="提交"
    @ok="submit"
    @cancel="() => { $emit('cancel') }"
  >
  <a-button  type="primary" @click="handleAdd">
    添加
  </a-button>
  <p></p>
  <a-table :columns="columns"  :rowSelection="rowSelection" :pagination="false"  :data-source="planDetailList" bordered>
    <template
      slot="code"
      slot-scope="text"
    >
    <div key="code">
      <!-- <div key="actualNum">
         <a-input-number
         v-if="record.editable"
         :min="1"
         :max="10"
         :step="1"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleInputChange(e, record ,'actualNum')"
        /> -->
        <template >
          {{ text }}
        </template>
      </div>
    </template>
    <template
      slot="dayIndexName"
      slot-scope="text, record, index"
    >
      <div key="dayIndexName" >
        <a-select style="width: 100%"  v-if="record.editable" :defaultValue="text" @change="(v,e)=>handleDayIndexChange(v,e,record.key)">
            <a-select-option v-for="item in dayList" :key="item.code" :value="item.code" :xx="index" :text="item.name" >{{ item.name}}</a-select-option>
        </a-select>
        <!-- <a-select   v-if="record.editable" :defaultValue="text" @change="val=>handleDayIndexChange(val,record.key)">
            <a-select-option v-for="item in dayIndexList" :key="item" :value="item" :xx="index"   >{{ item }}</a-select-option>
        </a-select> -->
        <!-- <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleChange(e.target.value, record.key, 'dayIndex',index)"
        /> -->
        <template v-else>
          {{ text}}
        </template>
      </div>
    </template>
    <template
      slot="startTime"
      slot-scope="text, record"
    >
      <div key="startTime">
        <!-- <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleChange(e.target.value, record.key, 'startTime',index)"
        /> -->
        <template v-if="record.editable" >
           <a-time-picker   :default-value="moment(text||'24:00', 'HH:mm')||null"  @change="(m,s)=>handleTimeChange(s,record,'startTime')" format="HH:mm" />
        </template>
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>
    <template
      slot="endTime"
      slot-scope="text, record"
    >
      <div key="endTime">
        <a-time-picker v-if="record.editable" :default-value="moment(text||'24:00', 'HH:mm')||null" @change="(m,s)=>handleTimeChange(s,record,'endTime')" format="HH:mm" />
        <template v-else>
          {{ text}}
        </template>
      </div>
    </template>

    <template
      slot="roomName"
      slot-scope="text, record, index"
    >
      <div key="roomName">
        <a-select style="width: 100%"  v-if="record.editable" :defaultValue="text" @change="(v,e)=>handleRoomChange(v,e,record.key)">
            <a-select-option v-for="item in roomList" :key="item.id" :value="item.code" :xx="index" :text="item.code" >{{ item.code}}</a-select-option>
        </a-select>
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>

    <template
      slot="subjectName"
      slot-scope="text, record, index"
    >
      <div key="subjectName">
        <a-select   v-if="record.editable" :defaultValue="text" @change="(v,e)=>handleSubjectChange(v,e,record.key)">
            <a-select-option v-for="item in subjectList" :key="item.id" :value="item.name" :xx="index" :text="item.name" >{{ item.name}}</a-select-option>
        </a-select>
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>

    <template
      slot="gradeName"
      slot-scope="text, record, index"
    >
      <div key="gradeName">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleChange(e.target.value, record.key, 'gradeName',index)"
        />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>

    <template
      slot="teacherName"
      slot-scope="text, record, index"
    >
      <div key="teacherName">
        <a-select style="width: 100%"  v-if="record.editable" :defaultValue="text" @change="(v,e)=>handleTeacherChange(v,e,record.key)">
            <a-select-option v-for="item in teacherList" :key="item.id" :value="item.name" :xx="index" :text="item.name" >{{ item.name}}</a-select-option>
        </a-select>
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>
    <template
      slot="lessonNum"
      slot-scope="text, record"
    >
      <div key="lessonNum">
         <a-input-number
         v-if="record.editable"
         :min="1"
         :max="10"
         :step="1"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleInputChange(e, record ,'lessonNum')"
        />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>
    <template
      slot="planNum"
      slot-scope="text, record"
    >
      <div key="planNum">
         <a-input-number
         v-if="record.editable"
         :min="1"
         :max="10"
         :step="1"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleInputChange(e, record ,'planNum')"
        />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>

    <template
      slot="actualNum"
      slot-scope="text"
    >
    <div key="actualNum">
      <!-- <div key="actualNum">
         <a-input-number
         v-if="record.editable"
         :min="1"
         :max="10"
         :step="1"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleInputChange(e, record ,'actualNum')"
        /> -->
        <template >
          {{ text }}
        </template>
      </div>
    </template>
    <template
      slot="status"
      slot-scope="text"
    >
    <div key="status">
        <template >
            {{ text|statusFilter }}
        </template>
      </div>
    </template>
    <template slot="operation" slot-scope="text, record, index">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record)">保存</a>
          <a-popconfirm title="确认取消?" @confirm="() => cancel(record,index)">
            <a>取消</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a-space>
            <a v-if="record.status==30031" :disabled="editingKey !== ''" @click="() => edit(record)">编辑</a>
            <a-popconfirm title="确认删除?" @confirm="() => delRecord(record,index)">
                <a v-if="record.status==30031" :disabled="editingKey !== ''" >删除</a>
            </a-popconfirm>
            <!-- <a :disabled="editingKey !== ''" @click="() => edit(record)">报名</a> -->
          </a-space>
        </span>
      </div>
    </template>
  </a-table>
  </a-modal>
</template>
<script>
/* eslint-disable */
import { listCoursePlanDetail,deleteCoursePlanDetail ,batchAddCoursePlanDetail} from '@/api/coursePlan'
import { listRoom } from '@/api/room'
import { listSubject } from '@/api/subject'
import { listTeacher } from '@/api/teacher'
import moment from 'moment'
/* eslint-disable */
const columns = [
  {
    title: '日期',
    dataIndex: 'dayIndexName',
    width: '8%',
    scopedSlots: { customRender: 'dayIndexName' },
  },
  {
    title: '课程编码',
    dataIndex: 'code',
    width: '8%',
    scopedSlots: { customRender: 'code' },
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    width: '8%',
    scopedSlots: { customRender: 'startTime' },
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: '8%',
    scopedSlots: { customRender: 'endTime' },
  },
  {
    title: '教室',
    dataIndex: 'roomName',
    width: '9%',
    scopedSlots: { customRender: 'roomName' },
  },
  {
    title: '科目',
    dataIndex: 'subjectName',
    width: '10%',
    scopedSlots: { customRender: 'subjectName' },
  },
  {
    title: '年级',
    dataIndex: 'gradeName',
    width: '10%',
    scopedSlots: { customRender: 'gradeName' },
  },
  {
    title: '老师',
    dataIndex: 'teacherName',
    width: '10%',
    scopedSlots: { customRender: 'teacherName' },
  },
  {
    title: '课时',
    dataIndex: 'lessonNum',
    width: '6%',
    scopedSlots: { customRender: 'lessonNum' },
  },
  {
    title: '计划人数',
    dataIndex: 'planNum',
    width: '6%',
    scopedSlots: { customRender: 'planNum' },
  },
  {
    title: '报名人数',
    dataIndex: 'actualNum',
    width: '6%',
    scopedSlots: { customRender: 'actualNum' },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '6%',
    scopedSlots: { customRender: 'status' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '10%',
    scopedSlots: { customRender: 'operation' },
  },
];
const statusMap = {
  30031: {
    status: 'new',
    text: '新纪录',
    color:'green'
  },
  30032: {
    status: 'scheduled',
    text: '已排期',
    color:'#1E90FF'
  },
  30033: {
    status: 'cancled',
    text: '已停课',
    color:'#708090'
  },
}

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
      default: () => '排课'
    },
    model: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      moment:moment,
      columns:columns,
      statusMap:statusMap,
      editingKey: '',
      planDetailList:[],
      cacheData:[],

      selectedRowKeys: [],
      selectedRows: [],

      // options 
      dayList:[],
      roomList:[{"id":1,"name":"教室"}],
      subjectList:[],
      gradeList:[],
      teacherList:[],
    }
  },
  created() {
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      debugger
      this.model && (this.init())
    })
  },
  mounted(){
    console.log("mounted")
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    }
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
    init(){
      this.loadPlanDetailData()
      this.loadOptions()
    },
    loadOptions(){
      
      // dayIndex
      if (this.model.cycleType=="0"){//日
        this.dayList=[
          {
            "code":1,
            "name":"每天"
          }
        ]
      }else if (this.model.cycleType=="1"){// 周
        this.dayList=[
          {
            "code":1,
            "name":"周一"
          },
          {
            "code":2,
            "name":"周二"
          },
          {
            "code":3,
            "name":"周三"
          },
          {
            "code":4,
            "name":"周四"
          },
          {
            "code":5,
            "name":"周五"
          },
          {
            "code":6,
            "name":"周六"
          },
          {
            "code":7,
            "name":"周日"
          }
        ]
      }
      // room
      this.loadRoom();

      // subject
      this.loadSubject();

      // grade
      
      // teacher 
      this.loadTeacher();

    },
    loadRoom(){
        let that =this
        var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'status', 'value': "10011", 'op': '='
          }]
        }
        const newObj = {"pageSize":1000, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
       listRoom(newObj)
          .then(res => {
            that.roomList=res.data
          })
    },
    loadSubject(){
        let that =this
        var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'status', 'value': "10011", 'op': '='
          }]
        }
        const newObj = {"pageSize":1000, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
       listSubject(newObj)
          .then(res => {
            that.subjectList=res.data
          })
    },
    loadTeacher(){
      let that =this
        var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'status', 'value': "10011", 'op': '='
          }]
        }
        const newObj = {"pageSize":1000, 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
       listTeacher(newObj)
          .then(res => {
            that.teacherList=res.data
          })
    },
    loadPlanDetailData() {
        let that =this
        var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'plan_id', 'value': this.model.id, 'op': '='
          }]
        }
        const newObj = { 'expr': JSON.stringify(expr) }
        console.log('loadData request parameters:', newObj)
       listCoursePlanDetail(newObj)
          .then(res => {
            let detailList = []
            for (let i =0 ;i<res.data.length;i++){
              detailList.push({
                key:i,
                ...res.data[i]
              })
            }
            that.planDetailList=detailList

            that.sort()

            that.cacheData = detailList.map(item => ({ ...item }));

          })
    },
    handleAdd(){
      this.planDetailList.push({
        key:this.planDetailList.length,
        editable:true,
        planId:this.model.id,
        planName:this.model.name,
        status:30031
      })
    },
    handleChange(value, key, column) {
      
      const newData = [...this.planDetailList];
      const target = newData.find(item => key === item.key);
      if (target) {
        target[column] = value;
        this.planDetailList = newData;
      }
    },
    edit(record) {
      const newData = [...this.planDetailList];
      const target = newData.find(item => record.key === item.key);
      this.editingKey = record.key;
      if (target) {
        target.editable = true;
        this.planDetailList = newData;
      }
    },
    sort(){
        this.planDetailList.sort((a,b)=>{
        if ( a.dayIndex>b.dayIndex ){
          return 1
        }else if (a.dayIndex<b.dayIndex){
          return -1
        }

        if (a.startTime>b.startTime){
          return 1
        }else {
          return -1
        }
      })
    },
    save(record) {
      const newData = [...this.planDetailList];
      const newCacheData = [...this.cacheData];
      const target = newData.find(item => record.key === item.key);
      const targetCache = newCacheData.find(item => record.key === item.key);

      delete target.editable;
      this.planDetailList = newData;

      this.sort();

      if (targetCache){
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }else{
        //新数据
        newCacheData.push({...target})
        this.cacheData = newCacheData;
      }
      this.editingKey = '';
    },
    cancel(record,index) {
      const newData = [...this.planDetailList];
      const target = newData.find(item => record.key === item.key);
      const cacheData = this.cacheData.find(item => record.key === item.key)
      this.editingKey = '';
      if (target&&cacheData) {
        this.planDetailList.splice(index,1,cacheData);
      }
    },
    delRecord(record) {
      let that = this

      let deleteLocal=function(){
          const planDetailList = that.planDetailList.filter(item => record.key !== item.key);
          const cacheData = that.cacheData.find(item => record.key !== item.key)

          that.planDetailList=planDetailList
          that.cacheData=cacheData
          that.editingKey = '';
      }

      if (!record.id){
        deleteLocal()
      }else{
        deleteCoursePlanDetail(record.id).then(res=>{
          deleteLocal()
        })
      }
    },
    handleDayIndexChange(val,e,key){
      debugger
      const newData = [...this.planDetailList];
      const target = newData.find(item => key === item.key);
      if (target) {
        target["dayIndex"] = e.key;
        target["dayIndexName"] = e.data.attrs.text;
        
        this.planDetailList = newData;
      }
    },

    handleTimeChange(time,record,col){
      
      const newData = [...this.planDetailList];
      const target = newData.find(item => record.key === item.key);
      if (target) {
        target[col] = time;
        this.planDetailList = newData;
      }
    },


    handleRoomChange(val,e,key){
      const newData = [...this.planDetailList];
      const target = newData.find(item => key === item.key);
      if (target) {
        target["roomId"] = e.key;
        target["roomName"] = e.data.attrs.text;
        
        this.planDetailList = newData;
      }
    },
    handleSubjectChange(val,e,key){
      const newData = [...this.planDetailList];
      const target = newData.find(item => key === item.key);
      if (target) {
        target["subjectId"] = e.key;
        target["subjectName"] = e.data.attrs.text;
        
        this.planDetailList = newData;
      }
    },
    handleTeacherChange(val,e,key){
      const newData = [...this.planDetailList];
      const target = newData.find(item => key === item.key);
      if (target) {
        target["teacherId"] = e.key;
        target["teacherName"] = e.data.attrs.text;
        
        this.planDetailList = newData;
      }
    },
    handleInputChange(val,record,col){
      const newData = [...this.planDetailList];
      const target = newData.find(item => record.key === item.key);
      if (target) {
        target[col] = val;
        this.planDetailList = newData;
      }
    },
    submit(){
      batchAddCoursePlanDetail({"data":this.planDetailList}).then(res=>{
        this.$emit('ok') 
        this.editingKey=''
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
  },
 
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
