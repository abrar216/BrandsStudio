export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-white/10 bg-white/5 text-brand-emerald focus:ring-brand-emerald focus:ring-offset-0 focus:ring-offset-transparent ' +
                className
            }
        />
    );
}
