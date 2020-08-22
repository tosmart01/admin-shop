<template>
  <div class="login">
    <div class="login-box">
      <div class="login-img">
        <img src="../assets/logo.png" alt="">
      </div>
      <div class="login-form">
        <!--表单-->
        <el-form label-width="0px" ref="loginForm" :model="form" :rules="rules">
          <el-form-item label="" prop="username" :error="Error.username">
            <el-input placeholder="请输入姓名" v-model="form.username" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>

          <el-form-item label="" prop="pwd">
            <el-input type="password" placeholder="请输入密码" v-model="form.pwd">
              <i slot="prefix" class="icon-lock"></i>
            </el-input>
          </el-form-item>

          <el-form-item label="" prop="code" :error="Error.code">
                 <!--验证码-->
            <div class="loginCode">
              <div>验证码:</div>
              <el-input class='loginCodeInput' @change="submit" maxlength="4" v-model="form.code" ></el-input>
              <div>
                <img :src="src+form.code_id" alt="" @click.prevent="codeUrl">
              </div>
            </div>
          </el-form-item>
        </el-form>


        <div class="login-btn">
          <el-button type="primary" @click.prevent="submit">登录</el-button>
          <el-button type="success" @click.prevent="reset">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import { v4 as uuidv4 } from 'uuid';
    import cookie from 'js-cookie'
    export default {
    data() {
      return {
        form: {
          username: 'wuwukai',
          pwd: 'w463313603.',
          code: '',
          code_id : uuidv4(),
        },
        Error:{
          username:'',
          pwd:'',
          code:'',
        },
        src:this.BaseHost + '/v1/api/code?code_id=',//'http://192.168.44.128/v1/api/code?code_id=',
        rules: {
          username: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在3到20个字符', trigger: 'change'}
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 25, message: '长度在6到25个字符', trigger: 'change'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
          ],

        }
      }
    },

    methods: {
      codeUrl () {
          this.form.code_id = uuidv4()
      },
      submit() {
        this.$refs.loginForm.validate(async flag => {
            if(flag){
              var {data: res} =await this.axios.post('api/user/login/',this.form)
              if(res.code != 200){
                  this.codeUrl()
                  this.$message.error(res.msg)
                  // this.Error.code = res.msg
              }else {
                this.$message.success('登录成功')
                console.log(res.data.username)
                cookie.set('token',res.data.token,new Date() + res.data.expires)
                const next_url =  location.search.split('?next=')
                if(next_url.length == 2){
                  return this.$router.push(decodeURIComponent(next_url[1]))
                }
                this.$router.push('/index')
              }
            }

        })
      },
      reset() {
        this.$refs.loginForm.resetFields()
        this.form.code = ''
      },

    }
  }

</script>


<style lang="less" scoped>
  .login {
    height: 100%;
    background-color: #2b4b6b;

    .login-box {
      width: 450px;
      height: 340px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 5px;
      background-color: #fff;

      .login-img {
        width: 130px;
        height: 130px;
        position: absolute;
        left: 50%;
        padding: 10px;
        box-shadow: 0 0 5px #eee;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background-color: #fff;

        img {
          width: 100%;
          height: 100%;
          background-color: #eee;
          border-radius: 50%;
        }
      }

      .login-form {
        width: 100%;
        position: absolute;
        padding: 20px;
        box-sizing: border-box;
        bottom: 0px;

        .login-btn {
          float: right;

          & button:nth-child(2) {
            border: 1px solid #eee;
            background-color: #eee;
            color: #1b6d85;
          }
        }

        .loginCode {
          height: 50px;
          line-height: 50px;
          margin-bottom: 5px;
          div {
            float: left;
            margin-right: 5px;
          }
          .loginCodeInput {
            height: 50px;
            width: 80px;
          }
          img {
            height: 40px;
            vertical-align: middle;
            cursor: pointer;

          }

        }


        .icon-lock {
          margin: 0px 0px 0px 7px;
        }

      }
    }
  }


</style>

