export function Container({ children }) {
    return (
        <div className="container">
            {children.map((x, i) => (
                <div key={i} className="container-item">
                    {x}
                </div>
            ))}
        </div>
    )
}
