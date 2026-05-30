type CardProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};
const Card = ({ children, title, subtitle }: CardProps) => {
  return (
    <div className="bg-foreground dark:bg-gray-800 shadow-md rounded-xl p-4 max-w-md w-full">
      <h1 className="text-2xl text-background dark:text-foreground font-semibold mb-1">
        {title}
      </h1>
      {subtitle && (
        <p className="text-background dark:text-foreground mb-4">{subtitle}</p>
      )}
      {children}
    </div>
  );
};

export default Card;
