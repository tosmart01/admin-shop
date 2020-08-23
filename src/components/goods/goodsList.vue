<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input clearable @clear="getGoodsList" v-model='querys.goods_name' placeholder="请输入内容"
                    class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5" class="el-col-btn">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!--商品表格-->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column class-name="goodsName" width="540px" label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column width="140px" label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column width="100px" label="商品数量" prop="goods_number"></el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete"
                       size="mini" @click="deleteGoods(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页-->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 100]"
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
      this.getGoodsList()

    },
    data() {
      return {
        goodsList: [],
        currentPage: 1,
        querys: {
          goods_name: '',
          offset: 0,
          limit: 10,
        },
        total: 0,
      }
    },
    methods: {

      async getGoodsList() {
        const {data: res} = await this.axios.get('/goods/goodslist/', {
          params: this.querys
        })
        if (res.code != 200) return this.$message.error('商品列表获取失败')
        this.goodsList = res.data.results
        this.total = res.data.count
      },
      //删除
      deleteGoods(id) {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data: res} = await this.axios.delete('goods/goodslist/' + id)
          if (res.code != 200) return this.$message.error(res.msg)
          this.getGoodsList()
          this.$message.success('删除成功')

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
      ,
      addGoods() {
        this.$router.push('/api/goodsSteps/')
      },
      //分页
      handleSizeChange(val) {
        this.querys.limit = val
        this.getGoodsList()
      }
      ,
      handleCurrentChange(val) {
        this.querys.offset = (val - 1) * this.querys.limit
        this.getGoodsList()
      }
      ,
    }
  }
</script>
<style lang="less" scoped>
  .el-col-btn {
    margin-left: 15px;
  }

  .el-table .goodsName div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
