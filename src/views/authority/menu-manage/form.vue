<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    menu_name: "",
    menu_url: "",
    status: 1,
    pid: "",
    sort: "",
    allMenuList: []
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function checkNode(e?: any) {
  newFormInline.value.pid = e[e.length - 1];
}
function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="formRules" label-width="82px">
    <el-form-item label="菜单父级" prop="pid">
      <el-cascader
        :options="newFormInline.allMenuList"
        v-model="newFormInline.pid"
        :props="{ checkStrictly: true, label: 'menu_name', value: 'id', children: 'children' }"
        @change="checkNode"
        style="width: 100%"
      >
      </el-cascader>
    </el-form-item>
    <el-form-item label="菜单名称" prop="menu_name">
      <el-input v-model="newFormInline.menu_name" clearable placeholder="请输入标题" />
    </el-form-item>
    <el-form-item label="菜单组件" prop="menu_url">
      <el-input v-model="newFormInline.menu_url" clearable placeholder="请输入标题" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="newFormInline.status">
        <el-radio :value="1">显示</el-radio>
        <el-radio :value="2">隐藏</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input v-model="newFormInline.sort" clearable placeholder="请输入标题" />
    </el-form-item>
    <el-form-item label="图标" prop="icon">
      <el-input v-model="newFormInline.icon" clearable placeholder="请输入标题" />
    </el-form-item>
  </el-form>
</template>
