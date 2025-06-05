import { useId } from "react"

import Input from "./input"

interface PrefixInputProps extends React.ComponentProps<"input"> {
  label?: string
  prefix?: string
}

export default function PrefixInput({
  prefix = "https://",
  ...inputProps
}: PrefixInputProps) {
  const id = useId()

  return (
    <div className="mt-1">
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
