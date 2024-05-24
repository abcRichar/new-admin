import { http } from "@/utils/http";

type Result = {
  code: number;
  msg: string;
  data: any;
  total?: number;
};

//----------------菜单管理
/** 列表 */
export const menuList = (data?: object) => {
  return http.request<Result>("get", "/menu/list", { data });
};

/** 添加 */
export const menuAdd = (data?: object) => {
  return http.request<Result>("post", "/menu/add", { data });
};

/** 详情 */
export const menuById = (data?: object) => {
  return http.request<Result>("get", "/menu/show", { data });
};

/** 编辑 */
export const menuEdit = (data?: object) => {
  return http.request<Result>("post", "/menu/update", { data });
};

/** 删除 */
export const menuDelete = (data?: object) => {
  return http.request<Result>("post", "/menu/detele", { data });
};

/** 所有菜单 */
export const allMenuList = (data?: object) => {
  return http.request<Result>("get", "/menu/accountMenuList", { data });
};

//----------------角色管理
/** 列表 */
export const roleList = (data?: object) => {
  return http.request<Result>("get", "/role/list", { data });
};

/** 添加 */
export const roleAdd = (data?: object) => {
  return http.request<Result>("post", "/role/add", { data });
};

/** 详情 */
export const roleById = (data?: object) => {
  return http.request<Result>("get", "/role/show", { data });
};

/** 编辑 */
export const roleEdit = (data?: object) => {
  return http.request<Result>("post", "/role/update", { data });
};

/** 删除 */
export const roleDelete = (data?: object) => {
  return http.request<Result>("post", "/role/detele", { data });
};

/** 分配权限 */
export const roleEditAuth = (data?: object) => {
  return http.request<Result>("post", "/role/update-auth", { data });
};
