import { ReactElement } from 'react';
export declare enum ROUTES {
    INFO = "/",
    FILES = "/files",
    UPLOAD = "/files/upload",
    UPLOAD_IN_PROGRESS = "/files/upload/workflow",
    DOWNLOAD = "/files/download",
    HASH = "/files/hash/:hash",
    SETTINGS = "/settings",
    STATUS = "/status",
    TOP_UP = "/account/wallet/top-up",
    TOP_UP_CRYPTO = "/account/wallet/top-up/crypto",
    TOP_UP_CRYPTO_SWAP = "/account/wallet/top-up/crypto/swap",
    TOP_UP_BANK_CARD = "/account/wallet/top-up/bank-card",
    TOP_UP_BANK_CARD_SWAP = "/account/wallet/top-up/bank-card/swap",
    TOP_UP_GIFT_CODE = "/account/wallet/top-up/gift-code",
    TOP_UP_GIFT_CODE_FUND = "/account/wallet/top-up/gift-code/fund/:privateKeyString",
    RESTART_LIGHT = "/light-mode-restart",
    ACCOUNT_WALLET = "/account/wallet",
    ACCOUNT_CHEQUEBOOK = "/account/chequebook",
    ACCOUNT_STAMPS = "/account/stamps",
    ACCOUNT_STAMPS_NEW = "/account/stamps/new",
    ACCOUNT_FEEDS = "/account/feeds",
    ACCOUNT_FEEDS_NEW = "/account/feeds/new",
    ACCOUNT_FEEDS_UPDATE = "/account/feeds/update/:hash",
    ACCOUNT_FEEDS_VIEW = "/account/feeds/:uuid",
    ACCOUNT_INVITATIONS = "/account/invitations",
    ACCOUNT_STAKING = "/account/staking"
}
export declare const ACCOUNT_TABS: ROUTES[];
declare const BaseRouter: () => ReactElement;
export default BaseRouter;
