// 诊断页面显示状态
console.log('=== 页面显示状态诊断 ===');

const pages = [
    'dialogueContainer',
    'homeContactsPage',
    'homeFindPage',
    'homeMyPage'
];

pages.forEach(pageName => {
    const page = document.querySelector('.' + pageName);
    if (page) {
        const styles = window.getComputedStyle(page);
        console.log(`\n${pageName}:`);
        console.log('  display:', styles.display);
        console.log('  visibility:', styles.visibility);
        console.log('  opacity:', styles.opacity);
        console.log('  transform:', styles.transform);
        console.log('  left:', styles.left);
        console.log('  top:', styles.top);
        console.log('  position:', styles.position);
        console.log('  zIndex:', styles.zIndex);
        console.log('  width:', styles.width);
        console.log('  height:', styles.height);
    } else {
        console.log(`\n${pageName}: 未找到`);
    }
});
