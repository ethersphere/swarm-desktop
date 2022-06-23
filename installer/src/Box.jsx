export function Box({ children, mb }) {
    const style = {
        marginBottom: mb ? mb * 8 : undefined
    }
    return <div style={style}>{children}</div>
}
