import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#918AE3',
  layout: 'mix',
  headerTheme: "dark",
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'MatchUs Admin',
  pwa: false,
  logo: 'https://s1.ax1x.com/2022/07/24/jjE18x.png',
  iconfontUrl: '',
};

export default Settings;
