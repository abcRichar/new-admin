import dayjs from "dayjs";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
// import { usePublicHooks } from "../../hooks";
// import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import { useChangePage } from "@/hooks/useChangePage";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
// import { getRoleList, getRoleMenu, getRoleMenuIds } from "@/api/system";
import { roleList, roleAdd, roleById, roleDelete, roleEdit, allMenuList, roleEditAuth } from "@/api/authority";
import { type Ref, reactive, ref, onMounted, h, toRaw, watch, nextTick } from "vue";

export function useData(treeRef: Ref) {
  const form = reactive({
    role_name: ""
  });
  const curRow = ref();
  const formRef = ref();
  const tableData = ref([]);
  const isShow = ref(false);
  const loading = ref(true);

  const treeIds = ref([]);
  const treeData = ref([]);
  const isLinkage = ref(false);
  const treeSearchValue = ref();
  const switchLoadMap = ref({});
  const isExpandAll = ref(false);
  const isSelectAll = ref(false);
  const treeProps = {
    value: "id",
    label: "menu_name",
    children: "children"
  };
  const { handleSizeChange, handleCurrentChange, pagination } = useChangePage(onSearch);

  const columns: TableColumnList = [
    {
      label: "编号",
      prop: "id"
    },
    {
      label: "角色名称",
      prop: "role_name"
    },
    // {
    //   label: "状态",
    //   prop: "status",
    //   formatter: ({ status }) => {
    //     return status === 1 ? "显示" : "隐藏";
    //   }
    // },
    {
      label: "创建时间",
      prop: "create_time",
      minWidth: 160
    },
    {
      label: "更新时间",
      prop: "update_time",
      minWidth: 160
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleDelete(row) {
    ElMessageBox.confirm(`确认要<strong>删除</strong><strong style='color:var(--el-color-primary)'>${row.title}</strong>吗?`, "系统提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
      draggable: true
    })
      .then(() => {
        roleDelete({
          id: row.id
        })
          .then(res => {
            message(`成功删除`, { type: "success" });
            onSearch();
          })
          .catch(err => {
            message(err.msg, { type: "error" });
          });
      })
      .catch(err => {});
  }

  async function onSearch() {
    loading.value = true;
    await roleList({
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      ...form
    })
      .then(res => {
        tableData.value = res.data;
        pagination.total = res.total;
        loading.value = false;
      })
      .catch(err => {
        tableData.value = [];
        pagination.total = 0;
        loading.value = false;
      });
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  /** 获取详情 */
  // const getNoticeById = (row?: FormItemProps) => {
  //   menuById({
  //     id: row.id
  //   })
  //     .then(res => {
  //       openDialog("编辑", res.data);
  //     })
  //     .catch(err => {
  //       message(err.msg, { type: "error" });
  //     });
  // };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}`,
      props: {
        formInline: {
          id: row?.id,
          title: row?.title || "",
          content: row?.content || "",
          status: row?.status || 1
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              roleAdd({
                title: curData.title,
                content: curData.content,
                status: curData.status
              })
                .then(res => {
                  chores();
                })
                .catch(err => {
                  message(err.msg, { type: "error" });
                });
              // 实际开发先调用新增接口，再进行下面操作
            } else if (title === "编辑") {
              // 实际开发先调用修改接口，再进行下面操作
              roleEdit({
                id: curData.id,
                title: curData.title,
                content: curData.content,
                status: curData.status
              })
                .then(res => {
                  chores();
                })
                .catch(err => {
                  message(err.msg, { type: "error" });
                });
            }
          }
        });
      }
    });
  }

  /** 菜单权限 */
  async function handleMenu(row?: any) {
    const { id } = row;
    if (id) {
      roleById({ id }).then(res => {
        console.log(res, "1", res.data.auth_ids.split(","));
        let arr = res.data.auth_ids.split(",").map(Number);
        console.log(arr, "1", allMenuListData.value);

        isShow.value = true;

        nextTick(() => {
          treeRef.value.setCheckedKeys(arr);
        });
      });

      curRow.value = row;
      console.log(row, "setCheckedKeys");
    } else {
      curRow.value = null;
      isShow.value = false;
    }
  }

  const filterMethod = (query: string, node) => {
    return node.title!.includes(query);
  };
  const onQueryChanged = (query: string) => {
    treeRef.value!.filter(query);
  };
  /** 高亮当前权限选中行 */
  function rowStyle({ row: { id } }) {
    return {
      cursor: "pointer",
      background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    };
  }

  /** 菜单权限-保存 */
  function handleSave() {
    const { id, role_name } = curRow.value;
    // 根据用户 id 调用实际项目中菜单权限修改接口
    console.log(id, treeRef.value.getCheckedKeys());

    roleEditAuth({
      id,
      auth_ids: treeRef.value.getCheckedKeys().toString()
    })
      .then(res => {
        isShow.value = false;
        message(`角色名称为${role_name}的菜单权限修改成功`, {
          type: "success"
        });
      })
      .catch(err => {
        console.log(err, "1");
      });

    // message(`角色名称为${name}的菜单权限修改成功`, {
    //   type: "success"
    // });
  }

  function getRulesTree(rulesList, id, list) {
    for (let item of rulesList) {
      if (item.pid === id) {
        list.push(item);
      }
    }
    for (let i of list) {
      i.children = [];
      getRulesTree(rulesList, i.id, i.children);
      if (i.children.length === 0) {
        delete i.children;
      }
    }
    return list;
  }

  const allMenuListData = ref([]);
  const getAllMenuList = () => {
    allMenuList()
      .then(res => {
        console.log(res, "1");
        allMenuListData.value = res.data;

        treeIds.value = getKeyList(allMenuListData.value, "id");
        // console.log(handleTree({ data: allMenuListData }), "1");
        /** 父子联动 折叠展开问题 */
        // treeData.value = handleTree({ data: allMenuListData });
        console.log(getRulesTree(res.data, 0, []));

        treeData.value = getRulesTree(res.data, 0, []);
      })
      .catch(err => {
        allMenuListData.value = [];
      });
  };

  onMounted(async () => {
    onSearch();
    getAllMenuList();
  });

  watch(isExpandAll, val => {
    val ? treeRef.value.setExpandedKeys(treeIds.value) : treeRef.value.setExpandedKeys([]);
  });

  watch(isSelectAll, val => {
    val ? treeRef.value.setCheckedKeys(treeIds.value) : treeRef.value.setCheckedKeys([]);
  });

  return {
    form,
    isShow,
    curRow,
    loading,
    columns,
    tableData,
    pagination,
    treeData,
    treeProps,
    isLinkage,
    isExpandAll,
    isSelectAll,
    treeSearchValue,
    // buttonClass,
    filterMethod,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSave,
    handleMenu,
    onQueryChanged
  };
}
