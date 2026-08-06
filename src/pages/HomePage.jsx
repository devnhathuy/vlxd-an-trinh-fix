import Hero from "../components/sections/Hero";
import Categories from "../components/sections/Categories";
import PriceTable from "../components/sections/PriceTable";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import Brands from "../components/sections/Brands";
import FeaturedProjects from "../components/home/FeaturedProjects";
import Reviews from "../components/sections/Reviews";
import News from "../components/sections/News";
import QuoteForm from "../components/sections/QuoteForm";
import Contact from "../components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <PriceTable />
      <FeaturedProducts />
      <WhyChooseUs />
      <Brands />
      <FeaturedProjects />
      <Reviews />
      <News />
      <QuoteForm />
      <Contact />
    </>
  );
}