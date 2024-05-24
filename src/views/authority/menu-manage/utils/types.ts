// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  title?: string;
  content?: string;
  status?: number;
  user_id?: number;
  id?: number;
  pid?: number | string;
  sort?: number | string;
  menu_name?: string;
  icon?: string;
  menu_url?: string;
  allMenuList?: any[];
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
