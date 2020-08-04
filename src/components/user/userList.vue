<template>
  <div>
    <!--用户列表-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <!--搜索框-->
          <el-input placeholder="请输入内容" class="input-with-select" v-model="querys.username" @change="searchUser"
                    clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <!--增加用户按钮-->
        <el-col :span="6">
          <el-button type="primary" @click="showGroupForm">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户表格-->
      <template>
        <el-table border :data="tableData" style="width: 100%;font-size: 13px;margin-top: 15px" stripe>
          <el-table-column type="index" label="id"></el-table-column>
          <el-table-column prop="username" label="姓名" width="150px"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="200px"></el-table-column>
          <el-table-column prop="telephone" label="电话"></el-table-column>
          <el-table-column prop="group" label="角色"></el-table-column>
          <el-table-column prop="is_active" label="是否激活">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_active"
                active-color="#13ce66"
                inactive-color="#C0CCDA" @change="changeActive(scope.row.id,scope.row.is_active)">
              </el-switch>
            </template>
          </el-table-column>
          <!--操作按钮-->
          <el-table-column prop="edit" label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="primary" icon="el-icon-edit"
                         @click="changeUserInfo(scope.row.id)" ></el-button>
              <el-button size="small" type="warning" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
              <el-tooltip :enterable="false" class="item" effect="dark" content="设置" placement="top-start">
                <el-button size="small" type="danger" icon="el-icon-s-tools"></el-button>
              </el-tooltip>
            </template>

          </el-table-column>
        </el-table>
      </template>
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
    <!-- 添加用户对话框   -->
    <el-dialog title="创建用户" :visible.sync="dialogVisible" width="50%"
               @close="handleClose">
      <!-- 添加用户表单-->
      <el-form ref="form" :rules="rules" :model="userForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密  码" prop="password">
          <el-input type="password" v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input type="password" v-model="userForm.password2"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="group">
          <el-select v-model="userForm.group" placeholder="请选择用户角色">
            <el-option :label="item.name" v-for="item in groups" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户对话框-->
    <el-dialog
      title="修改信息"
      :visible.sync="changeVisible"
      width="30%">
      <!-- 修改用户表单-->
      <el-form ref="updateForm" :rules="rules" :model="updateForm" label-width="80px">
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="updateForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="group">
          <el-select v-model="updateForm.group" placeholder="请选择用户角色" @click="">
            <el-option :label="item.name" v-for="item in groups" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button >取 消</el-button>
          <el-button type="primary" @click="changeSubmit(updateForm.id)">确 定</el-button>
        </span>
    </el-dialog>
    <!--删除用户-->


  </div>

</template>
<script>

  export default {
    created() {
      this.getUserList()
    },
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validemail = (rule, value, callback) => {
        var re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (!re.test(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }

      }
      return {
        tableData: [],
        querys: {
          offset: 0, limit: 5, username: '',
        },
        userForm: {
          username: 'wuwukai', password: '123456', password2: '12345', email: 'dsad@ca.com', group: ''
        },
        groups: [],

        rules: {
          username: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在3到20个字符', trigger: 'change'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 25, message: '长度在6到25个字符', trigger: 'change'}],
          password2: [
            {required: true, message: '请确认密码', trigger: 'blur'},
            {validator: validatePass2, trigger: 'change'},
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: validemail, trigger: 'change'},
          ],
          group: [
            {required: true, message: '请选择角色', trigger: 'change'},
          ]
        },
        currentPage: 1,
        total: 0,
        dialogVisible: false,
        changeVisible: false,
        updateForm:{
          username:'',email:'',role:'',
        }
      }
    },
    methods: {
      async getUserList(searchField) {
        console.log(searchField)
        var query = searchField ? searchField : this.querys

        const {data: res} = await this.axios.get('/api/user/', {
          params: query
        })
        if (res.code != 200) return this.$message.error('获取用户信息失败')
        this.tableData = res.data.results
        this.total = res.data.count
      },
      async changeUserInfo(id) {
        this.changeVisible = true
        const {data:res,status:status_code} = await this.axios.get('/api/user/'+id)
        if(res.code!=200) return this.$message.error('获取用户信息失败')
        this.updateForm = res.data
        this.axios.get('/api/user/grouplist/').then(({data: res}) => {
          if (res.code != 200) return this.$message.error('角色列表获取失败')
          this.groups = res.data
        })

      },
      async changeSubmit(id){
        console.log(this.updateForm)
        const {data:res} = await this.axios.put('/api/user/'+id,this.updateForm)
        if (res.code != 200) return this.$message.error('修改失败')
        this.changeVisible = false
        this.getUserList({})

      },
      async changeActive(id, active) {
        var act = active ? 1 : 0
        const {data: res} = await this.axios.put('/api/user/' + id, {
          is_active: act
        })
        if (res.code != 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')

      },
      handleSizeChange(val) {
        this.querys.limit = val
        this.getUserList()
      },
      handleCurrentChange(val) {
        this.querys.offset = (val - 1) * this.querys.limit
        this.getUserList()
      },
      searchUser() {
        this.getUserList({username: this.querys.username})
      },
      showGroupForm() {
        this.dialogVisible = true
        this.axios.get('/api/user/grouplist/').then(({data: res}) => {
          if (res.code != 200) return this.$message.error('角色列表获取失败')
          this.groups = res.data
        })

      },
      handleClose() {
        this.$refs.form.resetFields()
      },
      submitForm() {
        this.$refs.form.validate(async (flag) => {
          if (!flag) return this.$message.error('请填写用户信息')
          // console.log(this.userForm)
          const {data: res} = await this.axios.post('/api/user/', this.userForm)
          if (res.code != 200) return this.$message.error(res.msg)
          this.getUserList({})
          this.dialogVisible = false

        })
      },
     async deleteUser(id) {
        const resp = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch((flag)=>{
          this.$message.success('取消删除')
        })
       if(resp == 'confirm'){
         const {data:res} = await this.axios.delete('/api/user/'+id)
         if (res.code != 200) return this.$message.error('删除失败')
         this.$message.success('删除成功')
         this.getUserList({})
       }


    }


    }
  }
</script>
<style>
  .el-input {
    width: 300px;
  }

  .box-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3) !important;
  }

  .el-table {
    font-size: 10px;
  }

  .el-pagination {
    margin-top: 12px;
  }

  .el-form {
    width: 400px;
  }

</style>




