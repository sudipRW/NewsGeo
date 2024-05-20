import React, { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import hamburger from "../assets/more.png";
import close from "../assets/close.png";
import map from "../assets/map.svg";
import location from "../assets/location.svg";
import chrono from "../assets/chrono.svg";
import category from "../assets/category.svg";
import aggregation from "../assets/aggregation.svg";
import exp from "../assets/exp.svg";
import reliable from "../assets/reliable.svg";
import seamless from "../assets/seamless.svg";
import categorical from "../assets/categorical.svg";
import chronological from "../assets/chronological.svg";

const Home = () => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  useEffect(() => {
    const smoothScroll = () => {
      const links = document.querySelectorAll('a[href^="#"]');
      links.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href").substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 60,
              behavior: "smooth",
            });
          }
        });
      });
    };

    smoothScroll();
  }, []);

  return (
    <div className="home mx-auto font-sans relative">
      <div className="navbar sticky top-0 left-0 z-20 bg-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
        <div className="logo flex justify-between items-center mx-10 p-4">
          <img src={logo} alt="logo" className="w-[100px] h-[35px]" />
          <div className="hidden sm:flex gap-8 font-semibold">
            <a href="#home" className="hover:underline">
              Home
            </a>
            <a href="#about" className="hover:underline">
              About
            </a>
            <a href="#feature" className="hover:underline">
              Features
            </a>
            {/* <a href="#support" className="hover:underline">
              Support
            </a> */}
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </div>
          {/* <h2 className="text-xl font-semibold cursor-pointer">Sign in</h2> */}
          {!isMenuOpened && (
            <div className="hamburger block sm:hidden">
              <img
                src={hamburger}
                alt="more"
                className="w-10 h-10 cursor-pointer"
                onClick={() => setIsMenuOpened(true)}
              />
            </div>
          )}
        </div>
      </div>
      <div
        className={`menu flex flex-col gap-10 fixed top-0 sm:hidden w-[250px] transition-all p-4 bg-white h-full z-20 ${
          isMenuOpened ? "right-0" : "right-[-100%]"
        }`}
      >
        <div className="close">
          <img
            src={close}
            alt="close"
            className="w-10 h-10"
            onClick={() => setIsMenuOpened(false)}
          />
        </div>
        <div className="flex flex-col gap-8 font-semibold">
          <a
            href="#home"
            className="hover:underline"
            onClick={() => setIsMenuOpened(false)}
          >
            Home
          </a>
          <a
            href="#about"
            className="hover:underline"
            onClick={() => setIsMenuOpened(false)}
          >
            About
          </a>
          <a
            href="#feature"
            className="hover:underline"
            onClick={() => setIsMenuOpened(false)}
          >
            Features
          </a>
          {/* <a href="#support" className="hover:underline">
            Support
          </a> */}
          <a
            href="#contact"
            className="hover:underline"
            onClick={() => setIsMenuOpened(false)}
          >
            Contact
          </a>
        </div>
      </div>
      <div className="container w-[90%] mx-auto mt-10">
        <div className="home" id="home">
          <div className="header grid grid-cols-1 sm:grid-cols-2 p-4 gap-10 relative sm:mb-20">
            <div className="homeImg max-w-[600px] h-[400px] absolute opacity-5 sm:opacity-20 sm:static">
              <img src={map} alt="map" className="w-full h-full" />
            </div>
            <div className="heading flex justify-center flex-col text-center sm:text-start gap-4 z-10">
              <h1 className="text-[2.2rem] font-semibold text-[#A7A7A7] tracking-widest">
                Discover the Power of{" "}
                <span className="text-black">News Geo</span>
              </h1>
              <p className="text-lg ">
                Welcome to GeoNews, the premier platform for tailored news
                discovery. With GeoNews, empower your audience, enhance
                engagement, and elevate your brand presence.
              </p>
              <div className="text-2xl font-semibold px-4 py-2 bg-black rounded-md text-white md:w-[180px] sm:w-[160px] text-center self-center cursor-pointer">
                Get Access
              </div>
            </div>
          </div>

          <div className="sections grid grid-cols-1 sm:grid-cols-2 gap-10 mt-10">
            <div className="section  text-center flex flex-col gap-4 border-2 p-4 py-8 mt-4 rounded-md shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] relative">
              <div className="absolute -top-10 left-[40%] bg-white w-[80px] h-[80px] border-4 rounded-full flex justify-center items-center p-2">
                <img src={location} alt="img" className="w-[99%] h-[99%]" />
              </div>
              <h1 className="heading text-3xl font-semibold text-[#A7A7A7]">
                Explore News by <span className="text-black">Location</span>
              </h1>
              <p>
                From local insights to global perspectives, GeoNews delivers
                curated updates specific to your audience's geographical
                preferences. Connect them to relevant stories happening in their
                community and around the world effortlessly.
              </p>
            </div>
            <div className="section  text-center flex flex-col gap-4 border-2 p-4 py-8 mt-4 rounded-md shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] relative">
              <div className="absolute -top-10 left-[40%] bg-white w-[80px] h-[80px] border-4 rounded-full flex justify-center items-center p-4">
                <img src={category} alt="img" className="w-[99%] h-[99%]" />
              </div>
              <h1 className="heading text-3xl font-semibold text-[#A7A7A7]">
                Explore News by <span className="text-black">Category</span>
              </h1>
              <p>
                Dive into an array of topics that resonate with your audience,
                From politics and technology to business and entertainment. News
                Geo ensures your readers are always informed about the subjects
                that matter most to them.
              </p>
            </div>
            <div className="section  text-center flex flex-col gap-4 border-2 p-4 py-8 mt-4 rounded-md shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] relative sm:col-span-2">
              <div className="absolute -top-10 left-[40%] sm:left-[46.5%] bg-white w-[80px] h-[80px] border-4 rounded-full flex justify-center items-center p-4">
                <img src={chrono} alt="img" className="w-[99%] h-[99%]" />
              </div>
              <h1 className="heading text-3xl font-semibold text-[#A7A7A7]">
                Explore News by{" "}
                <span className="text-black">Chronologically</span>
              </h1>
              <p>
                Keep your audience engaged with News Geo’ chronological view.
                Help them stay up-to-date on evolving events and breaking news
                stories as they unfold. With News Geo, you can provide timely
                and relevant content to your readers.
              </p>
            </div>
          </div>
        </div>

        <div className="about py-10 text-center" id="about">
          <h1 className="text-3xl font-semibold">About Geo News</h1>
          <p className="mt-2">
            At GeoNews, we believe in the power of knowledge and the importance
            of staying informed in today's fast-paced world. Our platform is
            designed to empower users with personalized news experiences,
            allowing them to explore, discover, and engage with content that
            matters most to them.
          </p>
          <p className="mt-2">
            With a commitment to providing accurate, reliable, and relevant
            information, GeoNews aims to be your go-to destination for news
            aggregation. Whether it's local updates or global headlines, we
            strive to keep you connected to the world around you.
          </p>
          <p className="mt-2 font-semibold">
            Join us on this journey of exploration and discovery. Welcome to
            GeoNews.
          </p>
        </div>

        <div className="feature py-10 text-center border-b-2" id="feature">
          <h1 className="text-3xl font-semibold">
            Discover the Features of GeoNews
          </h1>
          <div className="features mt-10 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <img src={aggregation} alt="img" className="w-full h-full"/>
            <img src={categorical} alt="img" className="w-full h-full"/>
            <img src={chronological} alt="img" className="w-full h-full"/>
            <img src={exp} alt="img" className="w-full h-full"/>
            <img src={seamless} alt="img" className="w-full h-full"/>
            <img src={reliable} alt="img" className="w-full h-full"/>
          </div>
        </div>
      </div>

      <div className="contact bg-black py-10" id="contact">
        <h1 className="text-3xl font-semibold text-white text-center">Contact</h1>
      </div>
    </div>
  );
};

export default Home;
