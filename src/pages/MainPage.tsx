import { Header } from "@/widgets/Header";
import { Filters } from "@/features/AdminAuth/ui/Filters/ui/Filters";
import { Recipes } from "@/widgets/Recipes";

const MainPage = () => {
  return (
    <>
      <Header />
      <Filters />
      <Recipes />
    </>
  );
};

export default MainPage;
