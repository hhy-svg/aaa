# 微信模拟器 - 数据流程说明

## 1. 数据存储架构

### 存储位置
所有数据都存储在浏览器的 `localStorage` 中，使用 `storage.js` 工具类进行管理。

### 存储的数据类型

#### 1.1 好友信息列表 (friendInfoList)
- **存储键**: `wx_friendInfoList`
- **数据结构**:
```javascript
[
  {
    id: 'friend_001',           // 好友唯一ID
    nickname: '好友昵称',        // 昵称
    name: '好友昵称',           // 名称
    realName: '真实名字',       // 真实姓名
    sex: '1',                   // 性别 (1:男, 2:女)
    wxId: 'wxid_friend',        // 微信号
    avatar: './assets/img/...',  // 头像路径
    address: '中国大陆',        // 地区
    signature: '个性签名',      // 个性签名
    top: '0',                   // 是否置顶 (0:否, 1:是)
    unread: '0',                // 未读消息数
    AIChat: '0',                // 是否启用AI聊天
    bgImage: ''                 // 聊天背景图
  }
]
```

#### 1.2 聊天记录 (friendChatMsgList)
- **存储键**: `wx_friendChatMsgList_{friendId}` (每个好友一个独立的存储)
- **数据结构**:
```javascript
[
  {
    id: 'msg_001',              // 消息唯一ID
    role: 'self',               // 角色 (self:自己, other:对方, sys:系统)
    bodyContent: '消息内容',    // 消息主体内容
    type: 'text',               // 消息类型 (text:文本, img:图片, transfer:转账, sysTime:系统时间)
    citeContent: '',            // 引用的消息内容
    timestamp: 1234567890       // 时间戳
  }
]
```

#### 1.3 自己的信息 (selfInfo)
- **存储键**: `wx_selfInfo`
- **数据结构**:
```javascript
{
  id: 'selfInfoId',
  nickname: '司空震',
  sex: '1',
  wxId: 'wxid_skz',
  avatar: './assets/img/avatar_role/default_avatar1.jpg',
  address: '中国大陆',
  signature: '个性签名',
  realName: '真实名字',
  looseChange: 888.6,          // 零钱余额
  changeCard: 999.8,           // 零钱通余额
  yieldRate: 1.67              // 收益率
}
```

## 2. 数据初始化流程

### 2.1 首次访问
1. 用户访问 `init-data.html`
2. 点击"初始化示例数据"按钮
3. JavaScript 将默认数据写入 localStorage
4. 返回主页面 `index.html`

### 2.2 数据加载
在 `index.js` 中（混淆后的代码）：
```javascript
// 伪代码示例
const selfInfo = storage.get('wx_selfInfo', defaultSelfInfo);
const friendInfoList = storage.handleArr('wx_friendInfoList', defaultFriendInfo);
```

## 3. 数据渲染流程

### 3.1 好友列表渲染
1. **读取数据**: 从 localStorage 读取 `wx_friendInfoList`
2. **排序**: 按置顶、最后消息时间排序
3. **渲染**: 使用 `docEl.create()` 创建 DOM 元素
4. **显示**: 
   - 头像 (avatar)
   - 昵称 (nickname)
   - 最后一条消息预览 (lastTextMsg)
   - 最后消息时间 (lastTimeMsg)
   - 未读消息数 (unread)

代码位置: `index.js` 中的 `renderAll()` 函数

### 3.2 聊天记录渲染
1. **读取数据**: 从 localStorage 读取 `wx_friendChatMsgList_{friendId}`
2. **转换**: 使用 `chatMsgConvert.js` 将数据转换为 HTML
3. **渲染**: 插入到 `.dialogueFrameFriendChatContainer`
4. **滚动**: 自动滚动到最新消息

代码位置: `dialogueFrameFriend.js`

### 3.3 个人信息渲染
1. **读取数据**: 从 localStorage 读取 `wx_selfInfo`
2. **渲染**: 更新"我"页面的各个字段
   - 头像
   - 昵称
   - 微信号
   - 零钱余额
   - 零钱通余额

代码位置: `homeMy.js`

## 4. 数据更新流程

### 4.1 添加好友
1. 用户点击"添加朋友"
2. 打开 `curdAnythingPage` 表单
3. 填写好友信息
4. 调用 `storage.handleArr().set(newFriend)`
5. 重新渲染好友列表

### 4.2 发送消息
1. 用户输入消息
2. 创建消息对象
3. 调用 `storage.handleMultiArr().deep.set(newMsg)`
4. 渲染新消息到聊天界面
5. 更新好友列表的最后消息预览

### 4.3 修改个人信息
1. 用户点击"编辑自己信息"
2. 打开编辑表单
3. 修改信息
4. 调用 `storage.handleObj().set(updatedInfo)`
5. 重新渲染个人信息页面

## 5. 核心工具类

### 5.1 storage.js
提供 localStorage 的封装：
- `storage.get(key, defaultValue)` - 获取数据
- `storage.set(key, value)` - 设置数据
- `storage.handleArr(key, defaultData)` - 处理数组数据
- `storage.handleObj(key, defaultData)` - 处理对象数据
- `storage.handleMultiArr(key, defaultData)` - 处理多个数组

### 5.2 docEl.js
提供 DOM 操作的封装：
- `docEl.create(options)` - 创建元素
- `docEl.$(selector)` - 查询元素
- `docEl.getAll()` - 获取所有元素

### 5.3 chatMsgConvert.js
提供消息格式转换：
- 将消息数据转换为 HTML
- 处理不同类型的消息（文本、图片、转账等）

## 6. 数据持久化

### 6.1 自动保存
- 每次数据修改都会立即保存到 localStorage
- 不需要手动保存

### 6.2 数据备份
- 可以通过浏览器开发者工具导出 localStorage
- 或使用 `http.sendStorage()` 发送到服务器备份

### 6.3 数据清除
- 清除浏览器缓存会删除所有数据
- 可以通过 `storage.clear()` 清除特定数据

## 7. 调试技巧

### 7.1 查看存储的数据
在浏览器控制台执行：
```javascript
// 查看所有 localStorage
console.log(localStorage);

// 查看好友列表
console.log(JSON.parse(localStorage.getItem('wx_friendInfoList')));

// 查看自己的信息
console.log(JSON.parse(localStorage.getItem('wx_selfInfo')));

// 查看某个好友的聊天记录
console.log(JSON.parse(localStorage.getItem('wx_friendChatMsgList_friend_001')));
```

### 7.2 手动修改数据
```javascript
// 修改好友列表
let friends = JSON.parse(localStorage.getItem('wx_friendInfoList'));
friends[0].nickname = '新昵称';
localStorage.setItem('wx_friendInfoList', JSON.stringify(friends));
location.reload(); // 刷新页面查看效果
```

### 7.3 清除所有数据
```javascript
// 清除所有 wx_ 开头的数据
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('wx_')) {
    localStorage.removeItem(key);
  }
});
location.reload();
```

## 8. 数据流程图

```
用户操作
   ↓
JavaScript 事件处理
   ↓
数据验证和处理
   ↓
storage.js (localStorage)
   ↓
数据更新
   ↓
重新渲染 DOM
   ↓
用户看到更新后的界面
```

## 9. 注意事项

1. **数据大小限制**: localStorage 通常限制为 5-10MB
2. **数据格式**: 所有数据都以 JSON 字符串形式存储
3. **同步操作**: localStorage 是同步操作，大量数据可能影响性能
4. **跨域限制**: 不同域名的 localStorage 是隔离的
5. **安全性**: localStorage 数据可以被用户查看和修改

## 10. 扩展建议

如果需要更复杂的数据管理，可以考虑：
1. 使用 IndexedDB 替代 localStorage（支持更大容量）
2. 添加数据加密
3. 实现云端同步
4. 添加数据版本控制
5. 实现数据导入/导出功能
