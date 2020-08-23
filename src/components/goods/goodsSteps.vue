<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon>
      </el-alert>
      <el-steps :space="200" :active="activeName - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="formData" label-width="100px"
               ref="form" label-position="top" :rules="rule">
        <el-tabs tab-position="left" v-model="activeName"
                 :before-leave="tab_trigger">
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="formData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="formData.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="formData.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="formData.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="selectedCate">
              <el-cascader
                clearable
                v-model="formData.selectedCate"
                :options="options"
                :props="cascaderSet"
                @change="selectChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">
            <el-form-item :label="item.name" v-for="item in animate">
              <el-checkbox-group v-model="goods_animate" v-for="tag in item.tag">
                <el-checkbox border :label="tag" >{{tag.name}}</el-checkbox>
              </el-checkbox-group>

            </el-form-item>


          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-form-item :label="item.name" v-for="item in static">
              <el-checkbox-group v-model="goods_static" v-for="tag in item.tag">
                <el-checkbox border :label="tag" >{{tag.name}}</el-checkbox>
              </el-checkbox-group>

            </el-form-item>


          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <el-upload
              :action="imgUrl"
              list-type="picture-card"
              :headers="header"
              :name="'image'"
              multiple
              :on-preview="handlePictureCardPreview"
              :on-success="imageSuccess"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="400px" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <quill-editor ref="myQuillEditor"
              v-model="formData.goods_content"/>
            <el-button type="primary" class="btn" @click="formSubmit">添加商品</el-button>

          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import _ from 'lodash'
  import cookie from 'js-cookie'
  export default {
    created() {
      this.getGoodsCate()
    },
    data() {
      return {
        formData: {
          goods_name: '123',
          goods_price: '100',
          goods_weight: '20KG',
          goods_number: '20',
          selectedCate: [],
          goods_content:'',
        },
        imgUrl:this.BaseHost + '/v1/goods/image/upload/',//"http://192.168.44.128/v1/goods/image/upload/",
        goods_animate: [],
        goods_static: [],
        goods_image: [],

        animate: [],
        static: [],
        options: [],
        header: {
          'Authorization': 'JWT ' + cookie.get('token')

        },
        activeName: '1',
        dialogVisible: false,
        cascaderSet: {
          expandTrigger: 'hover',
          value: 'id',
          label: 'name',
          children: 'children'
        },
        dialogImageUrl: '',
        rule: {
          goods_name: [
            {required: true, message: '商品名称不能为空', trigger: 'blur'}
          ],
          goods_price: [
            {required: true, message: '商品价格不能为空', trigger: 'blur'}
          ],
          goods_weight: [
            {required: true, message: '商品重量不能为空', trigger: 'blur'}
          ],
          goods_number: [
            {required: true, message: '商品数量不能为空', trigger: 'blur'}
          ],
          selectedCate: [
            {required: true, message: '商品分类不能为空', trigger: 'blur'}
          ],

        }
      }
    },
    methods: {
      async selectChange() {
        if (this.formData.selectedCate.length == 3) {
          const {data: res} = await this.axios.get('goods/goodsinfo/' + this.cate_id)
          if (res.code != 200) return this.$message.info('商品参数获取失败')
          this.static = res.data.static
          this.animate = res.data.animate

        }
      },

      async getGoodsCate() {
        const {data: res} = await this.axios.get('goods/category/3?limit=9999')
        if (res.code != 200) return this.$message.info('商品分类获取失败')
        this.options = res.data.results
      },
      tab_trigger(_new, old) {
        if (_new != '1') {
          if (this.formData.selectedCate.length != 3) {
            this.$message.error('请选择分类')
            return false
          }
        }
      },
      imageSuccess(res) {
        this.goods_image.push(res.data)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = this.BaseHost +  file.response.data.image
        this.dialogVisible = true;

      },
      //提交商品
      formSubmit(){
        this.$refs.form.validate(async err=>{
          if(err){
            let _form = _.cloneDeep(this.formData)
            _form.goods_cate = _form.selectedCate[2]
            _form.goods_animate = this.goods_animate
            _form.goods_static = this.goods_static
            _form.goods_image= this.goods_image.map(v =>v.id)
            const {data:res} = await this.axios.post('goods/goodslist/',_form)
            if (res.code != 200) return this.$message.error(res.msg)
            this.$message.success('添加商品成功')
            this.$router.push('/api/goodslist/')



          }else {
            this.$message.error('请完善商品信息')
          }

        })
      },
      async handleRemove(file, fileList) {
        const id = file.response.data.id
        const {data: res} = await this.axios.delete('goods/image/delete/' + id)
        if (res.code != 200) {
          this.$message.error('图片清除失败')
          return false
        } else {
          const index = this.goods_image.findIndex(function (value) {
            return value.id == id
          })
          this.goods_image.splice(index, 1)
          this.$message.info('清除成功')
        }

      },

    },
    computed: {
      cate_id: function () {
        if (this.formData.selectedCate.length == 3) {
          return this.formData.selectedCate[2]
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-card .el-steps {
    margin: 19px;
  }

  .el-steps .el-step__title {
    font-size: 10px;
  }

  .el-form {
    width: 100%;
  }

  .el-cascader {
    margin-left: 0px;
    width: 220px;
  }

  .el-checkbox-group {
    float: left;
    margin-right: 10px;
  }


  .el-tab-pane .btn {
    margin-top: 15px;
  }

</style>
