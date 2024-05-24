import { http } from "@/utils/http";

type Result = {
  code: number;
  msg: string;
  data: any;
  total?: number;
};

/** 列表 */
export const noticeList = (data?: object) => {
  return http.request<Result>("get", "/notice/list", { data });
};

/** 添加 */
export const noticeAdd = (data?: object) => {
  return http.request<Result>("post", "/notice/add", { data });
};

/** 详情 */
export const noticeById = (data?: object) => {
  return http.request<Result>("get", "/notice/show", { data });
};

/** 编辑 */
export const noticeEdit = (data?: object) => {
  return http.request<Result>("post", "/notice/update", { data });
};

/** 删除 */
export const noticeDelete = (data?: object) => {
  return http.request<Result>("post", "/notice/detele", { data });
};
