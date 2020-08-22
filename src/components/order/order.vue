<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="querys.order_number"
                    class="input-with-select" clearable @clear="getOrderList()">
            <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" width="550px" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" width="150px" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_price" width="100px">
          <template slot-scope="scope">
            <el-tag type="primary" size="mini" v-if="scope.row.order_pay">已付款</el-tag>
            <el-tag type="warning" size="mini" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100px">
          <template slot-scope="scope">
            <el-tag type="primary" size="mini" v-if="scope.row.is_send">已发货</el-tag>
            <el-tag type="warning" size="mini" v-else>未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit"></el-button>
            <el-button type="success" @click="getOrderLogistics(scope.row.id)"
                       size="small" icon="el-icon-location"></el-button>

          </template>
        </el-table-column>
      </el-table>
      <!--物流信息对话框-->
      <el-dialog
        title="查看物流进度"
        :visible.sync="dialogVisible"
        width="50%"
      @close="closeLogistics">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(item, index) in logistics"
            :color="item.color"
            :key="index"
            :timestamp="item.ftime">
            {{item.content}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
      <!-- 分页-->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,10, 20, 100]"
        :page-size="querys.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
  export default {
    created() {
      this.getOrderList()
    },
    data() {
      return {
        searchText: '',
        orderList: [],
        currentPage: 1,
        dialogVisible: false,
        logistics:[],
        reverse:false,
        querys: {
          limit: 5,
          offset: 0,
          order_number: '',
        },
        total: 0,
      }
    },
    methods: {
      async getOrderList() {
        const {data: res} = await this.axios.get('order/list', {
          params: this.querys
        })
        if (res.code != 200) return this.$message.error('获取订单失败')
        this.orderList = res.data.results
        this.total = res.data.count
      },
      async searchOrder() {
        const {data: res} = await this.axios.get('order/list', {
          params: {
            order_number: this.querys.order_number
          }
        })

        if (res.code != 200) return this.$message.error('查询订单失败')
        this.orderList = res.data.results
      },
      //查询物流信息
      async getOrderLogistics(order_id) {
        this.dialogVisible = true
        const {data: res} = await this.axios.get('order/logistics/' + order_id)
        if (res.code != 200) return this.$message.error('查询订单物流失败')
        if(res.data.length >=1){
          res.data[0].color = '#0bbd87'
        }
        this.logistics = res.data
      },
      closeLogistics(){
        this.logistics = []
      },
      //分页
      handleSizeChange(val) {
        this.querys.limit = val
        this.getOrderList()
      }
      ,
      handleCurrentChange(val) {
        this.querys.offset = (val - 1) * this.querys.limit
        this.getOrderList()
      }
    }
  }
</script>
<style lang="less"></style>
