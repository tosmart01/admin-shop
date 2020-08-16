<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="openForm" type="primary">添加角色</el-button>
          <!-- 添加角色表单 -->
          <el-dialog
            title="添加角色"
            :visible.sync="dialogVisible"
            width="30%" @close="closeDialog">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="info">
                <el-input v-model="form.info"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addRole">提交</el-button>
                </span>
          </el-dialog>
        </el-col>
      </el-row>
      <!-- 展开权限列表-->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item,index) in scope.row.groups" :class="['top-border','row-first']">
              <!-- 分组-->
              <el-col :span="8">
                <el-tag closable @close="deletePerm(scope.row,item)">{{item.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 权限列表-->
              <el-col :span="16">
                <el-row v-for="(itemchild,index) in item.permissions" :class="[index==0 ?'' :'top-border']">
                  <!-- 权限列表1-->
                  <el-col>
                    <el-tag closable @close="deletePerm(scope.row,item,itemchild.id)" type="success">
                      {{itemchild.name}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="info" label="角色信息"></el-table-column>
        <el-table-column label='操作'>
          <template slot-scope="scope">

            <el-button size="small" type="primary" @click="changeRole(scope.row.id)">修改</el-button>
            <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button size="small" type="info" @click="addPerm(scope.row)">分配权限</el-button>

          </template>
        </el-table-column>
      </el-table>


      <!--修改角色表单 -->
      <el-dialog
        title="修改角色"
        :visible.sync="changeBox"
        width="30%">
        <el-form ref="form" :model="changeForm" label-width="80px" :rules="rules">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="changeForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="info">
            <el-input v-model="changeForm.info"></el-input>
          </el-form-item>
          <el-form-item label="权限组" prop="">
            <el-checkbox-group v-model="changeForm.groups" disabled>
              <el-checkbox :label="item.id" v-for="item in groups">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                  <el-button @click="changeBox = false">取 消</el-button>
                  <el-button type="primary" @click="changeRoleSubmit(changeForm.id)">提交</el-button>
                </span>
      </el-dialog>

      <!--分配权限对话框-->
      <el-dialog
        title="提示"
        :visible.sync="PermVisible"
        width="30%"
      >
        <!--分配权限Tree-->
        <el-tree
          ref="permTree"
          :data="loadNode"
          show-checkbox
          node-key="id"
          :default-checked-keys="checkPermList"
          default-expand-all
          :props="props">
        </el-tree>

        <span slot="footer" class="dialog-footer">
        <el-button @click="PermVisible = false">取 消</el-button>
        <el-button type="primary" @click="permSubmit">确 定</el-button>
      </span>
      </el-dialog>

    </el-card>

  </div>
</template>
<script>
  export default {
    created() {
      this.getRoleList()

    },
    data() {
      return {
        props: {
          label: 'name',
          children: 'permissions',
        },
        roleId: '',
        checkPermList:[],
        loadNode: [
          {
            id: 1, name: 'goods', permissions: [{
              id: 2, name: 'bread'
            }]
          }
        ],
        PermVisible: false,
        changeBox: false,
        roleList: [],
        dialogVisible: false,
        groups: [],
        form: {
          name: '',
          info: '',
          checkList: [],
        },
        changeForm: {
          id: '',
          name: '',
          info: '',
          groups: [],
        },
        rules: {
          name: [
            {required: true, message: '请输角色名称', trigger: 'blur'},
          ],
          info: [
            {required: true, message: '请输入角色描述', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      //分配权限
      async addPerm(obj) {
        this.PermVisible = true
        this.roleId = obj.id
        const {data: res} = await this.axios.get('/api/groupPerm/', {
          params: {
            role_id: this.roleId
          }
        })
        if (res.code != 200) return this.$message.error('获取权限列表失败')
        this.loadNode = res.data.results
        this.checkPermList = res.data.checklist

      },
      //添加权限
      async permSubmit() {
        var checkPerm = this.$refs.permTree.getCheckedKeys(true)
        const {data: res} = await this.axios.post(`/api/user/roleperm/${this.roleId}/`, {
          permlist: checkPerm
        })
        if (res.code != 200) return this.$message.error('添加权限失败')
        this.$message.success('添加权限成功')
        this.PermVisible = false
        this.getRoleList()


      },
      async getRoleList() {
        const {data: res} = await this.axios.get('/api/user/roleperm/',)
        if (res.code != 200) return this.$message.error('获取角色列表失败')
        this.roleList = res.data
      },
      //删除权限或组
      async deletePerm(role, group, perm) {
        const resp = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (resp !== 'confirm') return this.$message.info('取消删除')
        const {data: res} = await this.axios.put(`/api/user/roleperm/${role.id}/`, {
          group: group.id, perm
        })
        if (res.code != 200) return this.$message.error('删除权限失败')
        if(group && perm){
          group.permissions.splice(group.permissions.indexOf(perm),1)
        }else if(group && !perm) {
          role.groups.splice(role.groups.indexOf(group),1)
        }
      },
      async getGroupList() {
        const {data: res} = await this.axios.get('/api/group/')
        if (res.code != 200) return this.$message.error('权限列表获取失败')
        this.groups = res.data

      },
      openForm() {
        this.dialogVisible = true
        this.getGroupList()
      },
      //添加角色
      addRole() {
        this.$refs.form.validate(async val => {
          if (val) {
            const {data: res} = await this.axios.post('/api/user/rolelist/', this.form)
            if (res.code != 200) return this.$message.error(res.msg)
            this.$message.success('添加成功')
            this.dialogVisible = false
            this.getRoleList()
          }
        })
      },
      closeDialog() {
        this.$refs.form.resetFields()
        this.form.checkList = []
      },
      //删除角色
      async deleteRole(id) {
        const confirm = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirm != 'confirm') return this.$message.info('取消删除')

        const {data: res} = await this.axios.delete('/api/user/role/' + id)
        if (res.code != 200) return this.$message.error(res.msg)
        this.getRoleList()
      },
      //修改角色
      async changeRole(id) {
        this.changeBox = true
        const {data: res} = await this.axios.get('/api/user/role/' + id)
        if (res.code != 200) return this.$message.error('获取角色分组失败')
        this.getGroupList()
        this.changeForm = res.data


      },

      async changeRoleSubmit(id) {
        const {data: res} = await this.axios.put(`/api/user/role/${id}/`, this.changeForm)
        if (res.code != 200) return this.$message.error(res.msg)
        this.$message.success('修改成功')
        this.changeBox = false
        this.getRoleList()
      },

    }
  }
</script>
<style lang="less">
  .el-tag {
    margin: 9px;
  }

  .top-border {
    border-top: 1px solid #eee;
  }

  .el-row {
    display: flex;
    align-items: center;

  }

  .row-first {
    font-weight: 500;
    width: 600px;

  }

</style>
