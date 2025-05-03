
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      // Set default duration to dismiss notifications automatically
      duration={5000}
      // Add close button to all toasts
      closeButton={true}
      // Position toasts so they don't block UI elements
      position="top-right"
      // Expand width for better readability
      expand={false}
      // Use vibrant colors for better visibility
      richColors={true}
      {...props}
    />
  )
}

export { Toaster }
export { toast } from "sonner"
