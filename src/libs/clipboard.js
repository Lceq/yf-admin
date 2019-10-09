import Vue from 'vue';
import Clipboard from 'clipboard';

function clipboardSuccess () {
    console.log('success');
    Vue.prototype.$Message.success({
        content: '复制成功',
        type: 'success',
        duration: 1
    });
}

function clipboardError () {
    console.log('error');
    Vue.prototype.$Message.warning({
        message: '复制失败',
        type: 'error'
    });
}

export default function handleClipboard (text, event) {
    const clipboard = new Clipboard(event.target, {
        text: () => text
    });
    clipboard.on('success', () => {
        clipboardSuccess();
        clipboard.off('error');
        clipboard.off('success');
        clipboard.destroy();
    });
    clipboard.on('error', () => {
        clipboardError();
        clipboard.off('error');
        clipboard.off('success');
        clipboard.destroy();
    });
    clipboard.onClick(event);
}
