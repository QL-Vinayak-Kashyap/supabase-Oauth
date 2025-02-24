// Abbreviated for brevity - use the full version from shadcn/ui
import type { Toast } from "@/components/ui/toast"

export function useToast() {
  return {
    toast: ({ title, description }: { title?: string; description?: string }) => {},
    toasts: [] as (typeof Toast)[],
  }
}

