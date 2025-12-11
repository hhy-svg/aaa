// 账单长按菜单功能
import storage from './util/storage.js';
import constant from './constant.js';
import dialog from './util/dialog.js';
import hint from './util/hint.js';

const { STORAGE } = constant;

console.log('账单长按菜单功能加载中...');

// 添加样式
const style = document.createElement('style');
style.textContent = `
    /* 长按菜单弹出层 */
    .billing-longpress-popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        display: none;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }
    
    .billing-longpress-popup.show {
        display: flex;
        pointer-events: auto;
    }
    
    .billing-longpress-menu {
        background: white;
        border-radius: 0.8rem;
        overflow: hidden;
        min-width: 16rem;
        max-width: 80%;
    }
    
    .billing-longpress-option {
        padding: 1.2rem 2rem;
        text-align: center;
        border-bottom: 1px solid #f0f0f0;
        font-size: 1.1rem;
        cursor: pointer;
    }
    
    .billing-longpress-option:last-child {
        border-bottom: none;
    }
    
    .billing-longpress-option:active {
        background: #f0f0f0;
    }
    
    .billing-longpress-option.delete {
        color: #ff3b30;
    }
    
    .billing-longpress-option.cancel {
        color: #666;
    }
`;
document.head.appendChild(style);

// 长按菜单管理器
class LongPressMenuManager {
    constructor() {
        this.popup = null;
        this.longPressTimer = null;
        this.longPressDuration = 500; // 长按时长（毫秒）
        this.currentBillingId = null;
        this.createPopup();
        this.init();
    }
    
    createPopup() {
        this.popup = document.createElement('div');
        this.popup.className = 'billing-longpress-popup';
        this.popup.onclick = () => this.hide();
        document.body.appendChild(this.popup);
    }
    
    init() {
        // 使用事件委托监听账单列表 - 只在账单列表容器内监听
        const billingContainer = document.querySelector('.billingItemListContainer');
        
        if (billingContainer) {
            billingContainer.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
            billingContainer.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });
            billingContainer.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
            
            console.log('长按菜单监听器已启动（仅限账单列表）');
        } else {
            console.warn('未找到账单列表容器，长按功能未启动');
        }
    }
    
    onTouchStart(e) {
        const item = e.target.closest('.billingItemContent');
        if (!item) return;
        
        const billingId = item.getAttribute('billingid');
        if (!billingId) return;
        
        this.currentBillingId = billingId;
        
        // 设置长按定时器
        this.longPressTimer = setTimeout(() => {
            this.show(billingId);
        }, this.longPressDuration);
    }
    
    onTouchEnd(e) {
        // 清除长按定时器
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }
    
    onTouchMove(e) {
        // 如果手指移动，取消长按
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }
    
    show(billingId) {
        const menu = document.createElement('div');
        menu.className = 'billing-longpress-menu';
        
        menu.innerHTML = `
            <div class="billing-longpress-option edit">编辑账单</div>
            <div class="billing-longpress-option delete">删除账单</div>
            <div class="billing-longpress-option cancel">取消</div>
        `;
        
        menu.querySelector('.edit').onclick = (e) => {
            e.stopPropagation();
            this.handleEdit(billingId);
        };
        
        menu.querySelector('.delete').onclick = (e) => {
            e.stopPropagation();
            this.handleDelete(billingId);
        };
        
        menu.querySelector('.cancel').onclick = (e) => {
            e.stopPropagation();
            this.hide();
        };
        
        this.popup.innerHTML = '';
        this.popup.appendChild(menu);
        this.popup.classList.add('show');
        
        // 震动反馈（如果支持）
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    hide() {
        this.popup.classList.remove('show');
        this.currentBillingId = null;
    }
    
    handleEdit(billingId) {
        this.hide();
        console.log('编辑账单:', billingId);
        
        try {
            // 获取账单数据 - 直接调用 get 方法
            const billingList = storage.handleArr(STORAGE.BILLING_ITEM_LIST, []);
            const billingData = billingList.get(billingId);
            
            if (!billingData) {
                console.warn('未找到账单数据:', billingId);
                hint.error('未找到该账单');
                return;
            }
            
            // 获取编辑窗口元素
            const crudBillingItem = document.querySelector('.crudBillingItem');
            const crudBillingHeader = document.querySelector('.crudBillingHeader');
            const crudBillingAvatar = document.querySelector('.crudBillingAvatar');
            const crudBillingTitle = document.querySelector('.crudBillingTitle');
            const crudBillingMoney = document.querySelector('.crudBillingMoney');
            const crudBillingRemove = document.querySelector('.crudBillingRemove');
            
            if (!crudBillingItem) {
                console.error('未找到编辑窗口元素');
                hint.error('编辑功能不可用');
                return;
            }
            
            // 设置编辑窗口数据
            crudBillingHeader.innerText = '编辑账单';
            crudBillingItem.setAttribute('billingId', billingId);
            
            // 设置头像 - 需要同时设置背景图和属性
            if (crudBillingAvatar && billingData.avatar) {
                crudBillingAvatar.style.backgroundImage = `url('${billingData.avatar}')`;
                // 设置 bgImage 属性，这样保存时才能获取到头像
                crudBillingAvatar.setAttribute('bgImage', billingData.avatar);
            }
            
            // 设置标题和金额
            if (crudBillingTitle) crudBillingTitle.value = billingData.text || '';
            if (crudBillingMoney) crudBillingMoney.value = billingData.money || '';
            
            // 显示编辑窗口和删除按钮
            crudBillingItem.style.display = 'block';
            if (crudBillingRemove) crudBillingRemove.style.display = 'inline-block';
            
            console.log('编辑窗口已显示');
        } catch (error) {
            console.error('编辑账单失败:', error);
            hint.error('编辑失败，请重试');
        }
    }
    
    handleDelete(billingId) {
        this.hide();
        console.log('删除账单:', billingId);
        
        try {
            dialog.confirm({
                title: '删除账单',
                content: '确定要删除这条账单吗？',
                affirmFn: () => {
                    try {
                        const billingList = storage.handleArr(STORAGE.BILLING_ITEM_LIST, []);
                        billingList.delete(billingId);
                        
                        hint.success('删除成功');
                        
                        setTimeout(() => {
                            try {
                                if (billingList.execute && billingList.execute().renderAll) {
                                    billingList.execute().renderAll();
                                }
                            } catch (error) {
                                console.error('刷新列表失败:', error);
                            }
                        }, 500);
                        
                        return true;
                    } catch (error) {
                        console.error('删除账单失败:', error);
                        hint.error('删除失败，请重试');
                        return false;
                    }
                }
            });
        } catch (error) {
            console.error('显示删除确认对话框失败:', error);
            hint.error('操作失败，请重试');
        }
    }
}

// 初始化
setTimeout(() => {
    console.log('开始初始化账单长按菜单功能...');
    
    const menuManager = new LongPressMenuManager();
    
    console.log('账单长按菜单功能已启动');
    console.log('使用方法：长按账单项0.5秒即可弹出菜单');
}, 2000);
