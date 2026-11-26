import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const customButtonVariants = cva("custom-button", {
  variants: {
    variant: {
      primary: "custom-button--primary hover:bg-indigo-700",
      secondary: "custom-button--secondary",
      link: "custom-button--link"
    },
    size: {
      default: "custom-button--default",
      compact: "custom-button--compact"
    }
  },
  defaultVariants: {
    variant: "primary",
    size: "default"
  }
});

export type CustomButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof customButtonVariants>;

export function CustomButton({
  className,
  variant,
  size,
  ...props
}: CustomButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(customButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { customButtonVariants };
