import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, icon: Icon, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    // Parse classes to avoid collisions
    const classes = className.split(/\s+/).filter(Boolean);
    let bg = 'bg-white/5';
    let border = 'border-white/10';
    let rounded = 'rounded-2xl';
    let pl = Icon ? 'pl-11' : 'pl-4';
    let pr = 'pr-4';
    let py = 'py-4';
    let text = 'text-white';
    let focusBorder = 'focus:border-brand-emerald';
    let focusRing = 'focus:ring-brand-emerald/10';
    let placeholder = 'placeholder:text-white/20';

    classes.forEach(cls => {
        if (cls.startsWith('bg-')) bg = '';
        if (cls.startsWith('border-')) border = '';
        if (cls.startsWith('rounded-')) rounded = '';
        if (cls.startsWith('px-')) {
            pl = '';
            pr = '';
        }
        if (cls.startsWith('pl-')) pl = '';
        if (cls.startsWith('pr-')) pr = '';
        if (cls.startsWith('py-') || cls.startsWith('pt-') || cls.startsWith('pb-')) {
            py = '';
        }
        if (cls.startsWith('text-') && !['text-xs', 'text-sm', 'text-md', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'].includes(cls)) {
            text = '';
        }
        if (cls.startsWith('focus:border-')) focusBorder = '';
        if (cls.startsWith('focus:ring-')) focusRing = '';
        if (cls.startsWith('placeholder:text-')) placeholder = '';
    });

    const combinedInputClass = [
        'w-full border font-medium focus:outline-none transition-all',
        bg,
        border,
        rounded,
        pl,
        pr,
        py,
        text,
        focusBorder,
        focusRing,
        placeholder,
        className
    ].filter(Boolean).join(' ');

    const inputEl = (
        <input
            {...props}
            type={type}
            className={combinedInputClass}
            ref={localRef}
        />
    );

    if (Icon) {
        return (
            <div className="relative w-full flex items-center group">
                <div className="absolute left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                    {React.isValidElement(Icon) ? Icon : <Icon size={18} />}
                </div>
                {inputEl}
            </div>
        );
    }

    return inputEl;
});
