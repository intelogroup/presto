"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({ open: false, onOpenChange: () => {} })

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownContext.Provider value={{ open, onOpenChange: setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  )
}

function DropdownMenuTrigger({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { open, onOpenChange } = React.useContext(DropdownContext)
  return (
    <button
      data-slot="dropdown-trigger"
      aria-expanded={open}
      aria-haspopup="true"
      className={className}
      {...props}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) onOpenChange(!open)
      }}
    >
      {children}
    </button>
  )
}

function DropdownMenuContent({
  className,
  children,
  align = "end",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  const { open, onOpenChange } = React.useContext(DropdownContext)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.closest("[data-slot='dropdown-trigger']")?.contains(e.target as Node) && !ref.current.contains(e.target as Node)) {
        onOpenChange(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      ref={ref}
      data-slot="dropdown-content"
      role="menu"
      className={cn(
        "absolute z-50 mt-1 min-w-[12rem] overflow-hidden rounded-lg border border-border bg-card p-1 shadow-sm",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuItem({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { onOpenChange } = React.useContext(DropdownContext)
  return (
    <button
      data-slot="dropdown-item"
      role="menuitem"
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground outline-none hover:bg-muted focus:bg-muted",
        className
      )}
      {...props}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) onOpenChange(false)
      }}
    />
  )
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-separator"
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}
