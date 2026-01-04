import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t bg-gray-200 border-t-gray-300">
      <div className="mx-auto px-4 py-2">

        <div className="flex flex-col md:flex-row justify-between items-center">


          <div className="text-center md:text-left mb-2 md:mb-0">
            <h2 className="text-xl font-bold"> <span className='text-yellow-400'>Ann</span><span className='text-[#F83002]'>Seva</span> </h2>
            <p className="text-sm font-medium">Made with <i class="fa-solid text-orange-500 fa-heart"></i> By Avi</p>
          </div>


          <div className="flex items-center gap-2  lg:gap-4">

            <a
              href="https://www.linkedin.com/in/abinash-mishra-880a5b291/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white border border-orange-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-200/50 hover:shadow-xl"
              aria-label="LinkedIn"
            >
              <span className="absolute inset-0 bg-linear-to-br from-orange-500 to-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <i className="fa-brands fa-linkedin-in text-md text-gray-700 transition-colors duration-300 group-hover:text-white relative z-10"></i>
            </a>

            <a
              href="https://github.com/Abi04nash"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white border border-orange-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-200/50 hover:shadow-xl"
              aria-label="Github"
            >
              <span className="absolute inset-0 bg-linear-to-br  from-orange-500 to-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <i className="fa-brands fa-github text-md text-gray-700 transition-colors duration-300 group-hover:text-white relative z-10"></i>
            </a>

            <a
              href="https://abi04nash.github.io/AviPortfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white border border-orange-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-200/50 hover:shadow-xl"
              aria-label="Portfolio"
            >
              <span className="absolute inset-0 bg-linear-to-br  from-orange-500 to-red-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <i className="fa-solid fa-user text-md text-gray-700 transition-colors duration-300 group-hover:text-white relative z-10"></i>
            </a>
          </div>

        </div>
      </div>
    </footer>

  );
}

export default Footer;