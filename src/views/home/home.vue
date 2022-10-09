<script setup>
import {NSpace, NLayout, NLayoutHeader, NLayoutContent, NGrid, NGi, NLayoutSider} from 'naive-ui'
import {NButton, NDropdown,NMenu} from 'naive-ui'
// import {useRouter} from 'vue-router'
import {ref,h} from 'vue'
import { RouterLink } from "vue-router";
// import {useTokenStore} from "@/stores/useTokenStore"

// const tokener = useTokenStore()
// console.log(tokener.token, "=i am token")
// if (tokener.token == "") {
//   const router = useRouter()
//   router.push({path: "/login"})
// }

const options = [
  {
    label: () => h(
        RouterLink,
        {
          to: {
            name: "user",
            params: {
              lang: "zh-CN"
            }
          }
        },
        { default: () => "我的信息" }
    ),
    key: 'rmenu-my',
  },
  {
    label: () => h(
        RouterLink,
        {
          to: {
            name: "logout",
            params: {
              lang: "zh-CN"
            }
          }
        },
        { default: () => "退出系统" }
    ),
    key: "rmenu-exit"
  },
]

const handleSelect = function (key) {
  console.log(key)
}

const  activeKey= ref(null)
const menuOptions = [
  {
    label: "系统管理",
    key: "sys-setting",
    children: [
      {
        label: () => h(
            RouterLink,
            {
              to: {
                name: "user_list",
                params: {
                  lang: "zh-CN"
                }
              }
            },
            { default: () => "管理员管理" }
        ),
        key: "ss-user"
      },
      {
        label: () => h(
            RouterLink,
            {
              to: {
                name: "role_list",
                params: {
                  lang: "zh-CN"
                }
              }
            },
            { default: () => "角色管理" }
        ),
        key: "ss-role"
      },
      {
        label: () => h(
            RouterLink,
            {
              to: {
                name: "menu_list",
                params: {
                  lang: "zh-CN"
                }
              }
            },
            { default: () => "菜单管理" }
        ),
        key: "ss-menu"
      },
      {
        label: () => h(
            RouterLink,
            {
              to: {
                name: "config_list",
                params: {
                  lang: "zh-CN"
                }
              }
            },
            { default: () => "配置管理" }
        ),
        key: "ss-config"
      },
    ]
  },
  {
    label: "内容管理",
    key: "usr-content-",
    children: [
      {
        label: "分类管理",
        key: "uc-user"
      },
      {
        label: "页面管理",
        key: "uc-post"
      },
    ]
  },
];
</script>


<template>
  <n-space vertical size="large">
    <n-layout position="absolute">
      <n-layout-header>
        <n-grid x-gap="12" :cols="4">
          <n-gi>
            <router-link to="/welcome">一个管理系统</router-link>
          </n-gi>
          <n-gi :span="2">
            <div>
              <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
            </div>
          </n-gi>
          <n-gi>
            <div>
              <n-space justify="end">
                <n-space>
                  <n-dropdown trigger="click" :options="options" @select="handleSelect">
                    <n-button >
                      Hi admin
                    </n-button>
                  </n-dropdown>
                </n-space>
              </n-space>
            </div>
          </n-gi>
        </n-grid>
      </n-layout-header>
      <n-layout has-sider>
        <n-layout-sider
            collapse-mode="transform"
            :collapsed-width="0"
            :width="240"
            show-trigger="bar"
            content-style="padding: 24px;"
            bordered
        >
          <div>
            <n-menu v-model:value="activeKey" mode="vertical" :options="menuOptions" />
          </div>

        </n-layout-sider>
        <n-layout-content content-style="padding: 24px;">
          <router-view></router-view>
        </n-layout-content>
      </n-layout>
      <!--      <n-layout-footer>成府路</n-layout-footer>-->
    </n-layout>
  </n-space>
</template>

<style scoped>
.n-layout-header,
.n-layout-footer {
  background: rgba(128, 128, 128, 0.2);
  padding: 24px;
}

.n-layout-sider {
  background: rgba(128, 128, 128, 0.3);
}

.n-layout-content {
  background: rgba(128, 128, 128, 0.4);
  height:740px;
}
</style>