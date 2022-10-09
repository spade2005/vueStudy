<script>
import {defineComponent, ref, reactive, onMounted} from "vue";
import {
  NForm, NFormItem, NInput, NButton, NCheckbox, NCard, NTabs, NTabPane,
  NCheckboxGroup, NLayout, NLayoutSider, NLayoutContent, useMessage
} from 'naive-ui'
import roleAPi from "@/api/role.js"
import menuAPi from "@/api/menu.js"
import {useRouter} from 'vue-router'

export default defineComponent({
  components: {
    NForm, NFormItem, NInput, NButton, NCheckbox, NCheckboxGroup,
    NLayout, NLayoutSider, NLayoutContent, NCard, NTabs, NTabPane,
    useMessage, reactive
  },
  setup() {
    const message = useMessage()
    const formRef = ref(null);
    const router = useRouter()
    const model = reactive({
      name: '',
      id: router.currentRoute.value.query.id,
      type: 1,
      cMenu: [],
      rootList: [], subList: []
    });
    const getMenus = function () {
      roleAPi.getMenus({id: model.id, type: model.type}).then(function (resp) {
        if (resp.data.code === 0) {
          model.cMenu = resp.data.data
          console.log(resp.data.data, "222")
        }
      })
    }
    const getMenuList = function () {
      menuAPi.list({menu_type: model.type}).then(function (resp) {
        console.log(resp.data.data, "333")
        if (resp.data.code === 0) {
          let rl = resp.data.data.list.rootList??[]
          let srl = resp.data.data.list.subList??[]
          let srl_keys = Object.keys(srl)
          for (let i in srl_keys) {
            srl[srl_keys[i]] = srl[srl_keys[i]].map(t => {
              t['checked'] = false;
              if (model.cMenu.indexOf(t["id"]) >= 0) {
                t['checked'] = true;
              }
              return t;
            })
          }
          model.rootList = rl.map(t => {
            t['checked'] = false;
            if (model.cMenu.indexOf(t["id"]) >= 0) {
              t['checked'] = true;
            }
            return t;
          })
          model.subList = srl
        }
      })
    }

    onMounted(async () => {
      await roleAPi.one({id: model.id}).then(function (resp) {
        if (resp.data.code === 0) {
          model.name = resp.data.data.name
          model.mark = resp.data.data.mark
        }
      })
      await getMenus()
      await getMenuList()
    })

    return {
      formRef,
      model,
      rules: {},
      handleBeforeLeave: async (tabName) => {
        switch (tabName) {
          case "menuAuth":
            if (model.type == 2) {
              model.type = 1
              await getMenus()
              await getMenuList()
            }
            return true;
          case "dataAuth":
            if (model.type == 1) {
              model.type = 2
              await getMenus()
              await getMenuList()
            }
          default:
            return true;
        }
      },
      handleUpdateValue: (value) => {
        // message.info(value);
      },
      handleCheckedChange(it, subit) {
        let k = 'index_' + it['id']
        if (subit === null) {
          it.checked = !it.checked
          for (let i in model.subList[k]) {
            model.subList[k][i]['checked'] = it.checked
          }
        } else {
          subit.checked = !subit.checked
          if (subit.checked) {
            it.checked = subit.checked
          } else {
            let flag = true;
            for (let i in model.subList[k]) {
              if (model.subList[k][i]['checked']) {
                flag = false
                break
              }
            }
            if (flag) {
              it.checked = subit.checked
            }
          }
        }
      },
      handleValidateClick(e) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            let postData = {id: model.id, type: model.type, menuIds: ''}
            let ids = []
            for (let i in model.rootList) {
              if (model.rootList[i]['checked']) {
                ids.push(model.rootList[i]["id"])
              }
            }
            for (let i in model.subList) {
              for (let j in model.subList[i]) {
                if (model.subList[i][j]['checked']) {
                  ids.push(model.subList[i][j]['id'])
                }
              }
            }
            if (ids.length) {
              postData.menuIds = ids.join(",")
            }

            message.loading('正在提交...', {duration: 5000})
            roleAPi.saveMenus(postData).then(function (resp) {
              message.destroyAll()
              if (resp.data.code == 1) {
                message.error('update auth error:' + resp.data.message)
                return
              }
              message.success('update auth success!wait for jump..')

              setTimeout(function () {
                message.destroyAll()
                router.push({path: "/role/list"})
              }, 1500);

            }).catch(function (err) {
              console.log(err)
            })
          } else {

          }
        }).catch((er) => {
        })
      }
    }
  }
})
</script>

<template>
  <div class="create-box">
    <n-form
        ref="formRef" :model="model" :rules="rules"
        label-placement="left" label-width="auto" require-mark-placement="right-hanging"
        :style="{
      maxWidth: '640px'
    }"
    >

      <n-card :title="`更新角色[`+model.name+`]的权限`" style="margin-bottom: 16px">
        <n-tabs type="line" animated default-value="menuAuth"
                @before-leave="handleBeforeLeave"
                @update:value="handleUpdateValue"
        >
          <n-tab-pane name="menuAuth" tab="菜单权限">

            <template v-for="item in model.rootList" :key="item.id">
              <n-layout class="n-layout-top">
                <n-layout has-sider>
                  <n-layout-sider content-style="padding:0 24px;" width="150">
                    <n-checkbox :value="item.id" :label="item.name" @update:checked="handleCheckedChange(item,null)" :checked="item.checked"/>
                  </n-layout-sider>
                  <n-layout-content content-style="padding:0 24px;">
                    <template v-for="it in model.subList['index_'+item['id']]" :key="it.id">
                      <n-checkbox :value="it.id" :label="it.name" :checked="it.checked" @update:checked="handleCheckedChange(item,it)"/>
                    </template>
                  </n-layout-content>
                </n-layout>
              </n-layout>
            </template>

          </n-tab-pane>
          <n-tab-pane name="dataAuth" tab="操作权限">
            <template v-for="item in model.rootList" :key="item.id">
              <n-layout class="n-layout-top">
                <n-layout has-sider>
                  <n-layout-sider content-style="padding:0 24px;" width="150">
                    <n-checkbox :value="item.id" :label="item.name" @update:checked="handleCheckedChange(item,null)" :checked="item.checked"/>
                  </n-layout-sider>
                  <n-layout-content content-style="padding:0 24px;">
                    <template v-for="it in model.subList['index_'+item['id']]" :key="it.id">
                      <n-checkbox :value="it.id" :label="it.name" :checked="it.checked" @update:checked="handleCheckedChange(item,it)"/>
                    </template>
                  </n-layout-content>
                </n-layout>
              </n-layout>
            </template>
          </n-tab-pane>
        </n-tabs>
      </n-card>


      <n-form-item style="margin-top: 2rem;">
        <div style="margin-left: 3rem">
          <n-button round type="primary" @click="handleValidateClick">
            提交
          </n-button>
        </div>
        <div style="margin-left: 1rem">
          <router-link to="/role/list">
            <n-button round type="primary" secondary>
              返回
            </n-button>
          </router-link>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<style scoped>
.n-layout-top {
  margin-top: 1rem;
}
</style>

