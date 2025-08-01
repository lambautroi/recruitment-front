import Navbar from "../../components/homePage/Navbar";
import IntroSlide from "../../components/homePage/IntroSlide";
import CategorySlide from "../../components/homePage/CategorySlide";
import FeaturedJobSlide from "../../components/homePage/FeaturedJobSlide";
import JobIntroSlide from "../../components/homePage/JobIntroSlide";
import StatsAndEmployerSlide from "../../components/homePage/StatsAndEmployerSlide";
import Footer from "../../components/Footer";

export default function HomePage() {
    return (
        <div>
            <div className="container">
                <Navbar />
            </div>
            <div className="container">
                <IntroSlide />
            </div>
            <div className="container">
                <CategorySlide />
            </div>
            <div className="container">
                <FeaturedJobSlide />
            </div>
            <div className="container">
                <JobIntroSlide />
            </div>
            <div className="container">
                <StatsAndEmployerSlide />
            </div>
            <Footer />
        </div>
    );
}
