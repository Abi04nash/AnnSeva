import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t bg-gray-200 border-t-gray-300">
  <div className="mx-auto px-4 py-2">
    {/* flex for left & right */}
    <div className="flex flex-col md:flex-row justify-between items-center">
      
      {/* Left section */}
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h2 className="text-xl font-bold"> <span className='text-yellow-400'>Ann</span><span className='text-[#F83002]'>Seva</span> </h2>
        <p className="text-sm">Made with <i class="fa-solid fa-heart"></i> By Avi</p>
      </div>

      {/* Right section */}
      <div className="flex space-x-6 text-white">
        <a href="https://www.linkedin.com/in/abinash-mishra-880a5b291/" className="hover:text-gray-800 transition-colors" aria-label="LinkedIn">
          <i class="fa-brands fa-linkedin text-2xl text-black"></i>
        </a>
        <a href="https://github.com/Abi04nash" className="hover:text-gray-800 transition-colors" aria-label="Github">
         <i class="fa-brands fa-square-github text-2xl text-black"></i>
        </a>
        <a href="https://abi04nash.github.io/AviPortfolio/" className="hover:text-gray-800 transition-colors" aria-label="Portfolio">
          <i class="fa-solid fa-address-card text-2xl text-black"></i>
        </a>
      </div>

    </div>
  </div>
</footer>

  );
}

export default Footer;