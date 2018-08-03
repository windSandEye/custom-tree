###1.下载依赖
```
npm install 
```



###2.启动项目

```
npm start 
```

> 项目启动后的访问路径为:http://localhost:3000/



###3.组件替换入口(App.js)

组件替换入口文件位置为：src\App.js

```js
import React, { Component } from 'react';
import './App.css';
// import CustomTree from './components/familyNum/familyNum';
import CustomTree from './components/customTree/CustomCanvas';


class App extends Component {
  render() {
    return (
        <CustomTree fit={true}/>
    );
  }
}

export default App;

```



### 4.公共方法文件（TreeNode.js）

公共方法文件位置为：\src\components\common\TreeNode.js



> 项目是由create-react-app脚手架创建的，如有不理解的地方可去查看脚手架文档。