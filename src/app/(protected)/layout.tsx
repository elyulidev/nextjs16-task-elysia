import Nav from "@/components/nav";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>
        <Nav />
      </header>
      {children}
    </div>
  );
};

export default ProtectedLayout;
