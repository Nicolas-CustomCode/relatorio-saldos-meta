import { ButtonProps, ButtonVariant, Props } from "@/src/types/button";
import styles from '@/src/styles/components/buttons.module.css'

export function Button({children, variant, ...props}: Props) {
    return (
        <button className={styles[variant!]} {...props}>{children}</button>
    )
}
