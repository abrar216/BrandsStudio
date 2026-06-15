export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl bg-brand-emerald px-6 py-4 text-[11px] font-bold uppercase tracking-[2px] text-white transition-all duration-300 hover:bg-brand-emerald-light hover:shadow-[0_8px_32px_rgba(5,150,105,0.3)] focus:outline-none focus:ring-4 focus:ring-brand-emerald/20 active:scale-95 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
