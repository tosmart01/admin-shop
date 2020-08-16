<template>
  <div>

    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--提示信息-->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning" show-icon>
      </el-alert>
      <!--层级选择框-->
      <span>请选择商品分类:</span>
      <el-cascader
        v-model="selectedCate"
        :options="options"
        clearable
        :props="{ expandTrigger: 'hover',value:'id',label:'name' }"
        @change="handleChange"
      ></el-cascader>
      <!--Tab栏-->
      <el-tabs v-model="activeName">
        <el-tab-pane label="动态参数" name="0">
          <el-button size="mini" type="primary" :disabled="disabled" @click="showAddparams">添加参数</el-button>
          <!--动态参数表格-->
          <el-table
            :data="animateData"
            style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">

                <el-tag v-for="tag in scope.row.tag"
                        closable
                        :disable-transitions="false"
                        @close="tagClose(scope.row,tag)">
                  {{tag.name}}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>

              </template>

            </el-table-column>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showEditParams(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteParam(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--静态表格-->
        <el-tab-pane label="静态属性" name="1">
          <el-button size="mini" type="primary" :disabled="disabled" @click="showAddparams">添加属性</el-button>
          <el-table
            :data="staticData"
            style="width: 100%" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">

                <el-tag v-for="tag in scope.row.tag"
                        closable
                        :disable-transitions="false"
                        @close="tagClose(scope.row,tag)">
                  {{tag.name}}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>

              </template>

            </el-table-column>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showEditParams(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteParam(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!--添加参数对话框-->
      <el-dialog
        :title="'添加' + title"
        :visible.sync="paramVisible"
        width="30%">
        <el-form ref="form" :model="form" label-width="80px" :rules="rule"
                 @submit.native.prevent="paramSubmit">
          <el-form-item label="参数名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAddParam" size="small">取 消</el-button>
          <el-button type="primary" @click="paramSubmit" size="small">确 定</el-button>
        </span>
      </el-dialog>

      <!--编辑参数对话框-->
      <el-dialog
        :title="'编辑' + title"
        :visible.sync="editVisible"
        width="30%">
        <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rule"
                 @submit.native.prevent="paramEditSubmit">
          <el-form-item label="参数名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeEditParam" size="small">取 消</el-button>
          <el-button type="primary" @click="paramEditSubmit" size="small">确 定</el-button>
        </span>
      </el-dialog>


    </el-card>
  </div>
</template>
<script>
  export default {
    created() {
      this.getGoodsCate()

    },
    data() {
      return {
        selectedCate: [],
        options: [],
        activeName: 0,
        disabled: true,
        animateData: [],
        staticData: [],
        paramVisible: false,
        editVisible: false,
        form: {name: ''},
        editForm: {name: ''},
        editId: '',
        rule: {
          name: [
            {required: true, message: '请输入参数名称', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      async getGoodsCate() {
        const {data: res} = await this.axios.get('goods/category/3', {
          params: {limit: 9999}
        })
        if (res.code != 200) return this.$message.error('获取分类信息失败')
        this.options = res.data.results
      },
      closeAddParam() {
        this.$refs.form.resetFields()
        this.paramVisible = false
      },
      closeEditParam() {
        this.$refs.editForm.resetFields()
        this.editVisible = false
      },
      //删除参数
      deleteParam(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data: res} = await this.axios.delete('goods/goodsinfo/' + id)
          if (res.code != 200) return this.$message.error(res.msg)
          this.handleChange()
          this.$message.success('删除成功')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
      ,
      paramEditSubmit() {
        this.$refs.editForm.validate(async err => {
            if (err) {
              const {data: res} = await this.axios.put('goods/goodsinfo/' + this.editId,this.editForm)
              if (res.code != 200) return this.$message.error(res.msg)
              this.handleChange()
              this.$message.success('更新成功')
              this.editVisible = false
            }
          }
        )

      },
      //提交添加参数
      paramSubmit() {
        this.$refs.form.validate(async err => {
          if (err) {
            const {data: res} = await this.axios.post('goods/goodsinfo/', {
              name: this.form.name,
              sel: this.activeName,
              category: this.selectedCate[2]
            })
            if (res.code != 200) return this.$message.error(res.msg)
            this.$message.success('添加成功')
            this.handleChange()
            this.paramVisible = false
          }
        })
      },
      //编辑参数

      //添加参数对话框
      showAddparams() {
        this.paramVisible = true
      },
      //添加参数对话框
      showEditParams(row) {
        this.editVisible = true
        this.editId = row.id
        this.editForm.name = row.name
      },
      //标签关闭
      async tagClose(row, tag) {
        const {data: res} = await this.axios.delete('goods/goodstag/' + tag.id)
        if (res.code != 200) return this.$message.error(res.msg)
        row.tag.splice(row.tag.indexOf(tag), 1)
      }
      ,
      //新增标签
      async handleInputConfirm(row) {
        if (row.inputValue.trim()) {
          const {data: res} = await this.axios.post('goods/goodstag', {
            name: row.inputValue, goodsInfo: row.id
          })
          if (res.code != 200) return this.$message.error(res.msg)
          row.tag.push(res.data)
          this.$message.success('添加成功')

        }
        row.inputValue = ''
        row.inputVisible = false

      }
      ,
      //显示新增标签输入框
      showInput(row) {
        row.inputVisible = true
        // 渲染之后获得焦点
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })

      }
      ,
      //表格数据显示
      async handleChange() {
        if (this.selectedCate.length == 3) {
          this.disabled = false
          const {data: res} = await this.axios.get('goods/goodsinfo/' + this.selectedCate[2])
          if (res.code != 200) return this.$message.error('获取标签失败')
          res.data.animate.forEach(function (value, index) {
            value.inputValue = ''
            value.inputVisible = false
          })
          res.data.static.forEach(function (value, index) {
            value.inputValue = ''
            value.inputVisible = false
          })
          this.animateData = res.data.animate
          this.staticData = res.data.static
        } else {
          this.animateData = []
          this.staticData = []
          this.disabled = true
        }

      }
      ,
    },
    computed: {
      title: function () {
        return this.activeName == 0 ? '动态参数' : '静态属性'


      }
    }

  }
</script>
<style lang="less">
  .el-card {
    margin-top: 15px;
  }

  .el-cascader {
    margin-top: 18px;
    margin-left: 10px;
  }

  .el-tabs {
    margin-top: 20px;

  }

  .el-tag {
    margin: 12px;
  }

  .el-table .input-new-tag {
    width: 120px;
  }


</style>
