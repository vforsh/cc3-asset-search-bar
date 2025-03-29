# Asset Search Bar 资源搜索栏

Asset Search Bar 是一个免费的 Cocos Creator 3.x 扩展，它允许您快速搜索和打开项目中的资源。

![video](https://github.com/vforsh/cc3-asset-search-bar/blob/main/screenshots/asb-video.gif?raw=true)


## 主要特性

- 模糊搜索

- 现代简洁的用户界面，匹配 Cocos Creator 3.x 的暗色主题美学

- 可自定义的键盘快捷键


## 截图

![recent-items](https://github.com/vforsh/cc3-asset-search-bar/blob/main/screenshots/recent-items.png?raw=true)

![search-2](https://github.com/vforsh/cc3-asset-search-bar/blob/main/screenshots/search-2.png?raw=true)

![search-3](https://github.com/vforsh/cc3-asset-search-bar/blob/main/screenshots/search-3.png?raw=true)

![settings](https://github.com/vforsh/cc3-asset-search-bar/blob/main/screenshots/settings.png?raw=true)


## 下载与安装

### 从 Cocos Store 安装

要从 Cocos Store 安装扩展，请点击 *Extension -> Cocos Store* 选项打开 Cocos Store。

在搜索栏中输入 "**Asset Search Bar**"，找到它并安装。


### 从 Git 仓库下载

1. 克隆仓库 `git clone https://github.com/vforsh/cc3-asset-search-bar.git`

2. 进入扩展文件夹 `cd cc3-asset-search-bar`

3. 运行 `npm install` 安装依赖

4. 打开 Cocos Creator 编辑器，点击 *Extension -> Extension Manager -> Import extension folder*

5. 扩展导入后，您可以在菜单 *Extension -> Asset Search Bar* 中找到它。


## 使用方法

### 搜索和打开资源

1. 按下快捷键（默认为 `F1`）或点击 *Extension -> Asset Search Bar -> Search* 选项打开搜索栏。

2. 输入查询（资源名称），您将获得结果列表。

3. 滚动鼠标滚轮以滚动列表；按 `上箭头` 或 `下箭头` 选择文件；按 `左箭头` 或 `右箭头` 在资源面板中定位当前选中的文件。

4. 找到并选择目标文件，点击它或按 `Enter` 键打开。

然后，点击搜索栏外的任何位置或按 `ESC` 键关闭搜索栏。


### 设置

点击 *Extension -> Asset Search Bar -> Settings* 菜单选项打开设置面板。

在设置面板中，您可以选择预定义的键盘快捷键之一或输入自定义快捷键。

查看 Electron [Accelerator](https://www.electronjs.org/docs/api/accelerator) 文档以了解更多关于自定义快捷键的信息。


## 致谢

本扩展是 [@ifaswind](https://gitee.com/ifaswind) 开发的 [Quick Finder](https://gitee.com/ifaswind/ccc-quick-finder) 的一个分支。


## 贡献

在开始贡献之前，请阅读 [Cocos Creator 扩展开发指南](https://docs.cocos.com/creator/3.8/manual/en/editor/extension/readme.html) 和 [架构概述](./ARCHITECTURE.md)。
