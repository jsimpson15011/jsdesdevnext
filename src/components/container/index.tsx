export const Container = ({ children }: {children: JSX.Element[]}): JSX.Element => {
    return <div className="min-h-screen flex flex-col">{children}</div>;
};
