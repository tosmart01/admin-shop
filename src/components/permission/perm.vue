<template>
  <div>
      <!--面包屑导航-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
       <!--权限列表页-->
       <el-card>
         <el-table :data="permList" border stripe>
           <el-table-column type="index" label="id"></el-table-column>
           <el-table-column prop="codename" label="权限名称"></el-table-column>
           <el-table-column prop="content_type" label="所属分组"></el-table-column>
           <el-table-column prop="name" label="权限说明"></el-table-column>
         </el-table>
       <!-- 分页-->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 100]"
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
      this.getPermList()
    },
    data(){
      return {
        permList:[],
        querys:{
          limit:5,
          offset:0,
        },
        currentPage: 1,
        total:0,
      }
    },
    methods:{
      async getPermList(){
        const {data:res} = await this.axios.get('/api/perm/',{
          params:this.querys
        })
        if(res.code!=200)return this.$message.error('权限获取失败')
        this.permList = res.data.results
        this.total = res.data.count
      },
      handleSizeChange(val) {
        this.querys.limit = val
        this.getPermList()
      },
      handleCurrentChange(val) {
        this.querys.offset = (val - 1) * this.querys.limit
        this.getPermList()
      },
    }
  }
</script>


<style></style>
