# Asset Search Bar

Asset Search Bar is a free extension for Cocos Creator 3.x, it allows you to quickly search and open assets in your project.

![video](https://github.com/vforsh/cc3-asset-search-bar/blob/main/screenshots/asb-video.gif?raw=true)


## Key Features

- fuzzy search

- modern and clean UI that matches Cocos Creator 3.x dark aesthetic

- customizable keyboard shortcuts


## Screenshots

![recent-items](https://github.com/vforsh/cc3-asset-search-bar/blob/main/screenshots/recent-items.png?raw=true)

![search-2](https://github.com/vforsh/cc3-asset-search-bar/blob/main/screenshots/search-2.png?raw=true)

![search-3](https://github.com/vforsh/cc3-asset-search-bar/blob/main/screenshots/search-3.png?raw=true)

![settings](https://github.com/vforsh/cc3-asset-search-bar/blob/main/screenshots/settings.png?raw=true)


## Download & Installation

### Install from Cocos Store

**NOT AVAILABLE YET - STAY TUNED**

To install the extension from Cocos Store, click on *Extension -> Cocos Store* option to open the Cocos Store.

Enter "**Asset Search Bar**" in the search bar, find it and then install it.


### Download from git repository

1. Clone the repository `git clone https://github.com/vforsh/cc3-asset-search-bar.git`

2. Enter the extension folder `cd cc3-asset-search-bar`

3. Run `npm install` to install the dependencies

4. Open the Cocos Creator editor, click on *Extension -> Extension Manager -> Import extension folder*

5. After the extension is imported, you can find it in the menu *Extension -> Asset Search Bar*.


## Usage

### Search and open an asset

1. Press the shortcut key (The default is `F1`) or click on *Extension -> Asset Search Bar -> Search* option to open the search bar.

2. Enter the query (name of the asset) then you'll get a list of results.

3. Scroll the mouse wheel to scroll through the list; press the `Up Arrow` or `Down Arrow` to select file; press the `Left Arrow` or `Right Arrow` to locate the current selected file in Assets Panel.

4. Find and select your target file, click on it or press `Enter` to open it.

And then, click on anywhere outside the search bar or press `ESC` to close the search bar.


### Settings

Click on *Extension -> Asset Search Bar -> Settings* menu option to open the setting panel.

In the settings panel, you can choose one of the predefined keyboard shortcuts or enter a custom one.

Check the Electron [Accelerator](https://www.electronjs.org/docs/api/accelerator) documentation for more information about the custom shortcuts.


## Prior Art

This extension is a fork of [Quick Finder](https://gitee.com/ifaswind/ccc-quick-finder) by [@ifaswind](https://gitee.com/ifaswind).


## Contributing

Before you start contributing, please read the [Cocos Creator extension development guide](https://docs.cocos.com/creator/3.8/manual/en/editor/extension/readme.html) and [architecture summary](./ARCHITECTURE.md).
