import { Notification } from '../../Notification';
import { FC, Ref, useCallback, useEffect, useRef } from 'react';
import { atom, useAtom } from '../../../libs/atom';
import { TonAsset } from '@tonkeeper/core/dist/entries/crypto/asset/ton-asset';
import { styled } from 'styled-components';
import { SwapSearchInput } from './SwapSearchInput';
import { SwapTokensList } from './SwapTokensList';
import {
    useSwapTokensFilter,
    useWalletFilteredSwapAssets
} from '../../../state/swap/useSwapAssets';
import { SpinnerIcon } from '../../Icon';

const swapTokensListOpened$ = atom<{ onClose: (token: TonAsset | undefined) => void } | undefined>(
    undefined
);
export const useOpenSwapTokensList = (onClose: (token: TonAsset | undefined) => void) => {
    const [_, setIsOpen] = useAtom(swapTokensListOpened$);

    return useCallback(
        () =>
            setIsOpen(() => ({
                onClose
            })),
        [setIsOpen, onClose]
    );
};

export const SwapTokensListNotification: FC = () => {
    const [onSelect, setIsOpen] = useAtom(swapTokensListOpened$);

    const onClose = (asset: TonAsset | undefined) => {
        onSelect?.onClose(asset);
        setIsOpen(undefined);
    };

    return (
        <Notification isOpen={!!onSelect} handleClose={() => onClose(undefined)} title="Tokens">
            {() => <SwapTokensListContent onSelect={onClose} />}
        </Notification>
    );
};

const SwapSearchInputStyled = styled(SwapSearchInput)`
    margin-bottom: 1rem;
`;

const SwapTokensListContentWrapper = styled.div`
    height: calc(100% - 80px);
`;

const Divider = styled.div`
    width: calc(100% + 2rem);
    margin: 0 -1rem;
    height: 1px;
    background-color: ${p => p.theme.separatorCommon};
`;

const SpinnerContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
`;

const SwapTokensListContent: FC<{ onSelect: (token: TonAsset | undefined) => void }> = ({
    onSelect
}) => {
    const walletSwapAssets = useWalletFilteredSwapAssets();
    const inputRef = useRef<HTMLInputElement | undefined>();
    const [_, setFilter] = useSwapTokensFilter();

    useEffect(() => {
        setTimeout(() => inputRef?.current?.focus(), 100);
        return () => setFilter('');
    }, []);

    return (
        <SwapTokensListContentWrapper>
            <SwapSearchInputStyled
                ref={inputRef as Ref<HTMLInputElement> | undefined}
                isDisabled={!walletSwapAssets}
            />
            <Divider />
            {walletSwapAssets ? (
                <SwapTokensList onSelect={onSelect} walletSwapAssets={walletSwapAssets} />
            ) : (
                <SpinnerContainer>
                    <SpinnerIcon />
                </SpinnerContainer>
            )}
        </SwapTokensListContentWrapper>
    );
};
