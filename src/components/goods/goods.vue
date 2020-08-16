<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisibleOpen">添加分类</el-button>
        </el-col>
      </el-row>
      <!--添加分类对话框-->
      <el-dialog
        title="添加商品分类"
        :visible.sync="dialogVisible"
        width="40%"
        @close="GoodsClose"
      >
        <el-form ref="form" :model="form" label-width="30%" :rules="rule" @submit.native.prevent="categorySubmit">
          <el-form-item label="分类名称" prop="name" autofocus>
            <el-input ref="formInput" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="父类分类">
            <el-cascader
              v-model="selectedCategory"
              :options="options"
              clearable
              :props="{ expandTrigger: 'hover',value:'id',label:'name',checkStrictly:true}"
              @change="handleChange"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="categorySubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!--分类列表页-->
      <tree index-text="#"
            :data="data"
            :expand-type="false"
            :selection-type="false"
            :show-index="true"
            border
            stripe
            :columns="columns">
        <template slot="tem" slot-scope="scope">
          <i v-if="scope.row.is_active == true" class="el-icon-success" style="color: lightgreen"></i>
          <i v-else="scope.row.is_active == false" class="el-icon-error"></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag size="medium" v-if="scope.row.level == 1" type="success">一级分类</el-tag>
          <el-tag size="medium" v-else-if="scope.row.level == 2" type="warning">二级分类</el-tag>
          <el-tag size="medium" v-else type="danger">三级分类</el-tag>
        </template>
        <template slot="edit" slot-scope="scope">
          <el-button size="small" type="primary" @click="editCategory(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteCategory(scope.row)">删除</el-button>
        </template>

      </tree>
      <!--编辑表单-->
      <el-dialog
        title="编辑商品分类"
        :visible.sync="dialogVisibleEdit"
        width="40%"
        @close="GoodsEditClose"
      >
        <el-form ref="formEdit" :model="formEdit" label-width="30%" :rules="rule" @submit.prevent.native="GoodsEditSubmit">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="formEdit.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false" @close="GoodsEditClose">取 消</el-button>
        <el-button type="primary" @click="GoodsEditSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页-->
      <el-pagination
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
      this.getGoodsCategory()
    },
    data() {
      return {
        dialogVisible: false,
        data: [],
        form: {name:''},
        columns: [
          {
            label: '分类名称',
            prop: 'name',
          },
          {
            label: '是否有效',
            prop: 'is_active',
            type: 'template',
            template: 'tem'
          },
          {
            label: '分类等级',
            prop: 'level',
            type: 'template',
            template: 'level'
          },
          {
            label: '操作',
            prop: '',
            type: 'template',
            template: 'edit'
          }
        ],
        selectedCategory: [],
        options: [],
        formEdit: {},
        dialogVisibleEdit: false,
        Editid: '',
        //  分页
        querys: {
          limit: 5,
          offset: 0,
        },
        currentPage: 1,
        total: 0,
        rule: {
          name: [
            {required: true, message: '分类名不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      async getGoodsCategory() {
        const {data: res} = await this.axios.get('goods/category/3', {
          params: this.querys
        })
        if (res.code != 200) return this.$message.error('商品类别获取失败')
        this.data = res.data.results
        this.total = res.data.count

      },
      //编辑分类
      editCategory(val) {
        this.dialogVisibleEdit = true
        this.formEdit = {name: val.name}
        this.Editid = val.id
        this.EditLevel = val.level

      },
      GoodsEditClose() {
        this.dialogVisibleEdit = false
        this.$refs.formEdit.resetFields()
      },
      GoodsEditSubmit() {
        this.$refs.formEdit.validate(async err => {
          if (err) {
            const {data: res} = await this.axios.put('goods/category/' + this.Editid, {
              name: this.formEdit.name,
              level: this.EditLevel
            })
            if (res.code != 200) return this.$message.error(res.msg)
            this.dialogVisibleEdit = false
            this.$message.success('修改成功')
            this.getGoodsCategory()
          }
        })


      },
      //删除分类
      deleteCategory(val) {
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          console.log(val.level)
          const {data:res} = await this.axios.delete('goods/category/'+val.id,{
            data:{
              level:val.level
            }
          })
          if(res.code!=200) return this.$message.error(res.msg)
          this.$message.success('删除成功')
          this.getGoodsCategory()

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //连级选择
      handleChange() {

      },
      async dialogVisibleOpen() {
        this.dialogVisible = true
        const {data: res} = await this.axios.get('goods/category/2', {
          params: {limit: 9999}
        })
        if (res.code != 200) return this.$message.error('商品类别获取失败')
        this.options = res.data.results
        //页面渲染后 获得焦点
        this.$nextTick(_=>{
          this.$refs.formInput.$refs.input.focus()
        })
      },
      GoodsClose() {
        this.$refs.form.resetFields()
        this.selectedCategory = []
      },
      categorySubmit() {
        this.$refs.form.validate(async err => {
          if (err) {
            var f_id = null;
            var level = this.selectedCategory.length + 1
            if (level == 2) {
              f_id = this.selectedCategory[0]
            } else if (level == 3) {
              f_id = this.selectedCategory[1]
            }
            const {data: res} = await this.axios.post('goods/category/', {
              name: this.form.name,
              level: level,
              father: f_id,
            })
            if (res.code != 200) return this.$message.error(res.msg)
            this.$message.success('添加成功')
            this.getGoodsCategory()
            this.dialogVisible = false
          }
        })

      },

      //分页
      handleSizeChange(val) {
        this.querys.limit = val
        this.getGoodsCategory()
      },
      handleCurrentChange(val) {
        this.querys.offset = (val - 1) * this.querys.limit
        this.getGoodsCategory()
      },
    },
  }
</script>
<style lang="less">
  .el-row {
    margin-bottom: 20px;
  }
  .el-form .el-cascader {
    margin-top: 0;
  }

</style>
