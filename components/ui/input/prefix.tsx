import { useId } from "react"

import Input from "./input"
import { Label } from "@/components/ui/label"

interface PrefixInputProps extends React.ComponentProps<"input"> {
  label?: string
  prefix?: string
}

export default function PrefixInput({
  label = "Input",
  prefix = "https://",
  ...inputProps
}: PrefixInputProps) {
  const id = useId()

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          className="ps-15"
          {...inputProps}
        />
        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
          {prefix}
        </span>
      </div>
    </div>
  )
}
