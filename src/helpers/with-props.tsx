const withProps =
  <
    Component extends React.FC,
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
