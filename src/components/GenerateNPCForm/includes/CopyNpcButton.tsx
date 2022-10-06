import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { Values } from '../../MainForm/interfaces';
import { useFormikContext } from 'formik';

interface IProps {
    npcNumber: number;
    disabled: boolean;
}

const CopyNpcButton: FC<IProps> = ({ npcNumber, disabled }) => {
    const { values, setValues } = useFormikContext<Values>();

    const _onCopyNPC = useCallback(() => {
        if (disabled) {
            return;
        }

        if (!values.generatedNpc) {
            return;
        }

        const generatedNpc = [ ...values.generatedNpc ];
        generatedNpc.push(values.generatedNpc[npcNumber]);

        const newValues = { ...values, generatedNpc };

        setValues(newValues);
    }, [npcNumber, values, setValues, disabled]);

    return (
        <button
            type="button"
            className={cn('copy', disabled && 'disabled')}
            onClick={_onCopyNPC}
        />
    );
};

export default React.memo(CopyNpcButton);
