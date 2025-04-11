
export const metadata = {
  title: "쇼핑백 ",
};

//AuthProvider 필요할 것 같은데 없어도 잘되네;;
export default ({ children }: { children: React.ReactNode }) => {
  return (
    <>
        <section>{children}</section>
    </>
  );
};
