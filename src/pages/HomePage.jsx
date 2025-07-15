import Navbar from "../components/homePage/Navbar";
import IntroSlide from "../components/homePage/IntroSlide";
import CategorySlide from "../components/homePage/CategorySlide";
import FeaturedJobSlide from "../components/homePage/FeaturedJobSlide";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div>
            <div className="container">
                <Navbar />
            </div>
            <div className="container intro-slide">
                <IntroSlide />
            </div>
            <div className="container">
                <CategorySlide />
            </div>
            <div className="container">
                <FeaturedJobSlide />
            </div>
        </div>
    );
}
