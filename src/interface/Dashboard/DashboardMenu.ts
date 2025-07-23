export interface MenuItem {
    key: string;
    label: string;
    component: JSX.Element;
    roles: string[];
}

// 2. 定義選單群組的類型
export interface MenuGroup {
    title: string;
    items: MenuItem[];
}