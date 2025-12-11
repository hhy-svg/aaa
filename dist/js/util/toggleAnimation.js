import docEl from "./docEl.js";
import constant from "../constant.js";
const allEL = docEl.getAll();

const animationConfig = {
    dialogueFrameFriendPage: {
        name: 'leftSlide',
        duration: 0.2,
    },
    initiateTransferPage: {
        name: 'fadeMagnify',
        duration: 0.2,
    },
    dialogueFrameFriendMoreOperate: {
        name: 'startZeroHeight',
        duration: 0.2,
    },
    transferKeyboard: {
        name: 'moveUp',
        duration: 0.4,
    },
    payLoading: {
        name: 'zoomSlightlyfadeIn',
        duration: 0.2,
    },
    prepayment: {
        name: 'moveUp',
        duration: 0.2,
    },
    fingerprintPayVerify: {
        name: 'moveUp',
        duration: 0.2,
    },
    paymentResult: {
        name: 'moveUp',
        duration: 0.2,
    },
    homePageMoreMenu: {
        name: 'topRightFadeIn',
        duration: 0.15,
    },
    curdAnythingPage: {
        name: 'leftSlide',
        duration: 0.2,
    },
    addTransferRemarkBox: {
        name: 'fadeIn',
        duration: 0.2,
    },
    myServicePage: {
        name: 'leftSlide',
        duration: 0.2,
    },
    myWalletPage: {
        name: 'leftSlide',
        duration: 0.2,
    },
    masterSettingPage: {
        name: 'leftSlide',
        duration: 0.2,
    },
    msgAutoReplyPage: {
        name: 'leftSlide',
        duration: 0.2,
    },
    dialogueFrameTransferPage: {
        name: 'fadeMagnify',
        duration: 0.2,
    },
    billingItemListPage: {
        name: 'leftSlide',
        duration: 0.2,
    },
    billingItemDetailsPage: {
        name: 'leftSlide',
        duration: 0.2,
    },
    crudBillingItem: {
        name: 'leftSlide',
        duration: 0.2,
    },
    queryBillingByDateContainer: {
        name: 'fadeIn',
        duration: 0.2,
    },
}

export default {
    init() {
        for (const key in animationConfig) {
            allEL[key].toggleAnimation = animationConfig[key];
        }
    }
};