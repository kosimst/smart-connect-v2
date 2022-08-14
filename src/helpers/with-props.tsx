const withProps =
  <
    Component extends
      | keyof JSX.IntrinsicElements
      | React.JSXElementConstructor<any>,
    PassedProps extends Partial<React.ComponentProps<Component>>
  >(
    Element: Component,
    passedProps: PassedProps
  ): React.FC<
    Omit<React.ComponentProps<Component>, keyof PassedProps> &
      Partial<PassedProps>
  > =>
  (props) => {
    return (
      // @ts-ignore
      <Element
        {...({ ...passedProps, ...props } as React.ComponentProps<Component>)}
      />
    )
  }

export default withProps
