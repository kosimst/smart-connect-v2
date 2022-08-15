import { CSSProperties, FC, memo, Ref } from 'react'

type WithBaseProps<P extends Record<string, any> = {}, RefType = any> = P & {
  ref?: Ref<RefType>
  className?: string
  style?: CSSProperties
}

const forwardBaseProps = <P extends Record<string, any> = {}, RefType = any>(
  render: (props: P, baseProps: WithBaseProps<{}, RefType>) => JSX.Element
) =>
  memo((({ ref, style, className, ...props }) =>
    render(props as P, {
      className,
      style,
      ref,
    })) as FC<WithBaseProps<P, RefType>>)

export default forwardBaseProps
