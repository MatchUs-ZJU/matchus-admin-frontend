declare namespace API {
  type ResponseData<T> = {
    msg: string;
    data: T;
    code: string;
    success: boolean;
  };

  type NormalSuccessData = {
    success: boolean;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type LoginResult = {
    token?: string;
  };

  type CurrentUser = {
    name?: string;
    avatar?: string;
    access?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type PaginationResult = {
    total?: number; // 数据总数
    size?: number; // 页容量
    current?: number; // 当前页
    pages?: number; // 总页数
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type Order = {
    id?: number;
    petId?: number;
    quantity?: number;
    shipDate?: string;
    /** Order Status */
    status?: 'placed' | 'approved' | 'delivered';
    complete?: boolean;
  };

  type Category = {
    id?: number;
    name?: string;
  };

  type User = {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    /** User Status */
    userStatus?: number;
  };

  type Tag = {
    id?: number;
    name?: string;
  };

  type Pet = {
    id?: number;
    category?: Category;
    name: string;
    photoUrls: string[];
    tags?: Tag[];
    /** pet status in the store */
    status?: 'available' | 'pending' | 'sold';
  };

  type ApiResponse = {
    code?: number;
    type?: string;
    message?: string;
  };
  type HistoryData = {
    id?: number;
    totalTerm?: number;
    matchs?: number;
    participants?: number;
    unavailable?: number;
  };
  type CarouselData = {
    id?: number;
    image?: string;
    sequence?: number;
  };
}
