<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "",
    content: "",
    status: 1
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="formRules" label-width="82px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="newFormInline.title" clearable placeholder="请输入标题" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="newFormInline.status">
        <el-radio :value="1">显示</el-radio>
        <el-radio :value="2">隐藏</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="内容">
      <el-input v-model="newFormInline.content" placeholder="请输入内容" type="textarea" />
    </el-form-item>
  </el-form>
</template>
